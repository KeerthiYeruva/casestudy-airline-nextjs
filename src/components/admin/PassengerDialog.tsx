"use client";

import React, { useEffect, useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  FormHelperText,
  Box,
} from "@mui/material";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";
import type { Flight } from "@/types/flight";
import type { Passenger } from "@/types/passenger";
import SeatSelectionDialog from "./SeatSelectionDialog";

interface PassengerFormData extends Omit<Passenger, "id"> {
  id: string;
}

interface PassengerDialogFormData extends Omit<PassengerFormData, "passport" | "address" | "dateOfBirth"> {
  passport: NonNullable<PassengerFormData["passport"]>;
  address: string;
  dateOfBirth: string;
}

interface PassengerDialogProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  passengerForm: PassengerFormData;
  onFormChange: (form: PassengerFormData) => void;
  onSave: (form: PassengerFormData) => void | Promise<void>;
  flights: Flight[];
  allPassengers: Passenger[];
}

const shopRequestSchema = z.object({
  itemId: z.string(),
  itemName: z.string(),
  category: z.string(),
  price: z.number(),
  quantity: z.number(),
  currency: z.string(),
});

const passengerDialogSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Passenger name is required"),
  seat: z.string().trim().min(1, "Seat number is required"),
  flightId: z.string().min(1, "Flight selection is required"),
  passport: z.object({
    number: z.string().trim().min(1, "Passport number is required"),
    expiryDate: z.string(),
    country: z.string(),
  }),
  address: z.string().trim().min(1, "Address is required"),
  dateOfBirth: z.string()
    .min(1, "Date of birth is required")
    .refine((value) => {
      const selectedDate = new Date(`${value}T00:00:00`);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selectedDate <= today;
    }, "Date of birth cannot be in the future"),
  ancillaryServices: z.array(z.string()),
  specialMeal: z.string(),
  wheelchair: z.boolean(),
  infant: z.boolean(),
  checkedIn: z.boolean(),
  bookingReference: z.string()
    .regex(/^[A-Z]{3}[0-9]{3,7}$/, "Invalid booking reference format (e.g., ABC123)")
    .or(z.literal("")),
  shopRequests: z.array(shopRequestSchema),
  seatPreferences: z.custom<PassengerFormData["seatPreferences"]>().optional(),
  groupSeating: z.custom<PassengerFormData["groupSeating"]>().optional(),
  familySeating: z.custom<PassengerFormData["familySeating"]>().optional(),
  premiumUpgrade: z.boolean().optional(),
});

const requiredSeatFields = [
  "name",
  "flightId",
  "passport.number",
  "address",
  "dateOfBirth",
] as const;

const normalizePassengerForm = (form: PassengerFormData): PassengerDialogFormData => ({
  ...form,
  passport: form.passport || { number: "", expiryDate: "", country: "" },
  address: form.address || "",
  dateOfBirth: form.dateOfBirth || "",
});

const PassengerDialog: React.FC<PassengerDialogProps> = ({
  open,
  onClose,
  editMode,
  passengerForm,
  onFormChange,
  onSave,
  flights,
  allPassengers,
}) => {
  const [seatDialogOpen, setSeatDialogOpen] = useState(false);
  const {
    control,
    getValues,
    handleSubmit,
    reset,
    setValue,
    trigger,
    formState: { errors },
  } = useForm<PassengerDialogFormData, unknown, PassengerDialogFormData>({
    resolver: zodResolver(passengerDialogSchema),
    defaultValues: normalizePassengerForm(passengerForm),
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset(normalizePassengerForm(passengerForm));
    }
  }, [open, passengerForm, reset]);

  const formValues = useWatch({ control }) as PassengerDialogFormData;
  const selectedFlight = flights.find((flight) => flight.id === formValues.flightId);
  const isRequiredFieldsFilled = requiredSeatFields.every((field) => {
    const value = getValues(field);
    return typeof value === "string" && value.trim().length > 0;
  });

  const handleClose = () => {
    reset(normalizePassengerForm(passengerForm));
    setSeatDialogOpen(false);
    onClose();
  };

  const handleOpenSeatDialog = async () => {
    const isValid = await trigger(requiredSeatFields);
    if (isValid) {
      setSeatDialogOpen(true);
    }
  };

  const handleSelectSeat = (seat: string) => {
    setValue("seat", seat, { shouldDirty: true, shouldValidate: true });
  };

  const handleSave = async (formData: PassengerDialogFormData) => {
    onFormChange(formData);
    await onSave(formData);
  };

  const updateAssistanceService = (serviceName: string, enabled: boolean) => {
    const currentServices = getValues("ancillaryServices") || [];
    const updatedServices = enabled
      ? Array.from(new Set([...currentServices, serviceName]))
      : currentServices.filter((service) => service !== serviceName);

    setValue("ancillaryServices", updatedServices, { shouldDirty: true });
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{editMode ? "Edit Passenger" : "Add Passenger"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: editMode ? 6 : 12 }}>
            <Controller
              name="name"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  label="Name"
                  error={!!errors.name}
                  helperText={errors.name?.message || ""}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: editMode ? 6 : 12 }}>
            <Controller
              name="flightId"
              control={control}
              render={({ field }) => (
                <FormControl fullWidth required error={!!errors.flightId}>
                  <InputLabel>Flight</InputLabel>
                  <Select {...field} label="Flight">
                    {flights.map((flight) => (
                      <MenuItem key={flight.id} value={flight.id}>
                        {flight.flightNumber} - {flight.origin} → {flight.destination} ({new Date(flight.departureTime).toLocaleDateString()})
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.flightId && <FormHelperText>{errors.flightId.message}</FormHelperText>}
                </FormControl>
              )}
            />
          </Grid>

          {editMode && (
            <Grid size={{ xs: 12, sm: 6 }}>
              <Box sx={{
                p: 1.5,
                border: '1px solid #e0e0e0',
                borderRadius: 1,
                backgroundColor: formValues.seat ? '#e8f5e9' : '#f5f5f5',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                height: '56px'
              }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  {formValues.seat ? `Seat: ${formValues.seat}` : 'No seat'}
                </Typography>
                <Button
                  variant="outlined"
                  size="small"
                  startIcon={<AirlineSeatReclineNormalIcon />}
                  onClick={handleOpenSeatDialog}
                  disabled={!isRequiredFieldsFilled}
                >
                  {formValues.seat ? 'Change' : 'Select'}
                </Button>
              </Box>
            </Grid>
          )}

          <Grid size={12}>
            <Divider sx={{ my: 1 }}>
              <Typography variant="caption">Passport Details</Typography>
            </Divider>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name="passport.number"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  label="Passport Number"
                  error={!!errors.passport?.number}
                  helperText={errors.passport?.number?.message || ""}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name="passport.expiryDate"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Expiry Date"
                  type="date"
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              )}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <Controller
              name="passport.country"
              control={control}
              render={({ field }) => (
                <TextField {...field} fullWidth label="Country" />
              )}
            />
          </Grid>

          <Grid size={12}>
            <Controller
              name="address"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  label="Address"
                  multiline
                  rows={2}
                  error={!!errors.address}
                  helperText={errors.address?.message || ""}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="dateOfBirth"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  required
                  label="Date of Birth"
                  type="date"
                  slotProps={{
                    inputLabel: { shrink: true },
                    htmlInput: { max: new Date().toISOString().split('T')[0] },
                  }}
                  error={!!errors.dateOfBirth}
                  helperText={errors.dateOfBirth?.message || ""}
                />
              )}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <Controller
              name="bookingReference"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  fullWidth
                  label="Booking Reference"
                  onChange={(event) => field.onChange(event.target.value.toUpperCase())}
                  error={!!errors.bookingReference}
                  helperText={errors.bookingReference?.message || "Format: 3 letters + 3-7 digits (e.g., ABC123, BKG1234567)"}
                  placeholder="BKG123456"
                />
              )}
            />
          </Grid>

          {!editMode && (
            <Grid size={12}>
              <Divider sx={{ my: 1 }} />
            </Grid>
          )}

          {!editMode && (
            <>
              <Grid size={12}>
                <Divider sx={{ my: 1 }}>
                  <Typography variant="caption">Seat Selection</Typography>
                </Divider>
              </Grid>

              <Grid size={12}>
                <Box sx={{
                  p: 2,
                  border: '1px solid #e0e0e0',
                  borderRadius: 1,
                  backgroundColor: formValues.seat ? '#e8f5e9' : '#f5f5f5',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                        {formValues.seat ? `Selected Seat: ${formValues.seat}` : 'No seat selected'}
                      </Typography>
                      {!isRequiredFieldsFilled && (
                        <Typography variant="caption" color="text.secondary">
                          Please fill all required fields above to select a seat
                        </Typography>
                      )}
                    </Box>
                    <Button
                      variant="contained"
                      startIcon={<AirlineSeatReclineNormalIcon />}
                      onClick={handleOpenSeatDialog}
                      disabled={!isRequiredFieldsFilled}
                      size="large"
                    >
                      {formValues.seat ? 'Change Seat' : 'Select Seat'}
                    </Button>
                  </Box>
                  {errors.seat && (
                    <Typography variant="caption" color="error">
                      {errors.seat.message}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </>
          )}

          <Grid size={12}>
            <FormGroup row>
              <Controller
                name="wheelchair"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(event) => {
                          const isWheelchair = event.target.checked;
                          field.onChange(isWheelchair);
                          updateAssistanceService("Wheelchair Assistance", isWheelchair);
                        }}
                      />
                    }
                    label="Wheelchair"
                  />
                )}
              />
              <Controller
                name="infant"
                control={control}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={(event) => {
                          const isInfant = event.target.checked;
                          field.onChange(isInfant);
                          updateAssistanceService("Infant Care Kit", isInfant);
                        }}
                      />
                    }
                    label="Infant"
                  />
                )}
              />
            </FormGroup>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit(handleSave)} variant="contained">
          {editMode ? "Update" : "Add"}
        </Button>
      </DialogActions>

      <SeatSelectionDialog
        open={seatDialogOpen}
        onClose={() => setSeatDialogOpen(false)}
        onSelectSeat={handleSelectSeat}
        selectedSeat={formValues.seat}
        flightId={formValues.flightId}
        flight={selectedFlight}
        allPassengers={allPassengers}
        currentPassengerId={formValues.id}
      />
    </Dialog>
  );
};

export default PassengerDialog;
