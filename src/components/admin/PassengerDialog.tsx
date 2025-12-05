"use client";

import React, { useState } from "react";
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
  SelectChangeEvent,
  FormHelperText,
  Box,
} from "@mui/material";
import { Passenger, Flight } from "@/types";
import SeatSelectionDialog from "./SeatSelectionDialog";
import AirlineSeatReclineNormalIcon from "@mui/icons-material/AirlineSeatReclineNormal";

interface PassengerFormData extends Omit<Passenger, "id"> {
  id: string;
}

interface PassengerDialogProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  passengerForm: PassengerFormData;
  onFormChange: (form: PassengerFormData) => void;
  onSave: () => void;
  flights: Flight[];
  allPassengers: Passenger[];
}

interface ValidationErrors {
  name?: string;
  flightId?: string;
  passport?: string;
  address?: string;
  dateOfBirth?: string;
  seat?: string;
}

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
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Set<string>>(new Set());
  const [seatDialogOpen, setSeatDialogOpen] = useState(false);

  const selectedFlight = flights.find(f => f.id === passengerForm.flightId);

  const validateField = (fieldName: string, value: string | undefined) => {
    let error = "";
    
    switch (fieldName) {
      case "name":
        if (!value || !value.trim()) {
          error = "Passenger name is required";
        }
        break;
      case "flightId":
        if (!value) {
          error = "Flight selection is required";
        }
        break;
      case "passport":
        if (!value || !value.trim()) {
          error = "Passport number is required";
        }
        break;
      case "address":
        if (!value || !value.trim()) {
          error = "Address is required";
        }
        break;
      case "dateOfBirth":
        if (!value || !value.trim()) {
          error = "Date of birth is required";
        } else {
          const selectedDate = new Date(value);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          if (selectedDate > today) {
            error = "Date of birth cannot be in the future";
          }
        }
        break;
      case "seat":
        if (!value || !value.trim()) {
          error = "Seat number is required";
        }
        break;
    }
    
    return error;
  };

  const handleBlur = (fieldName: string) => {
    setTouched(prev => new Set(prev).add(fieldName));
    const value = fieldName === "passport" 
      ? passengerForm.passport?.number 
      : passengerForm[fieldName as keyof PassengerFormData] as string;
    const error = validateField(fieldName, value);
    setErrors(prev => ({ ...prev, [fieldName]: error }));
  };

  const handleSave = () => {
    // Validate all required fields
    const newErrors: ValidationErrors = {};
    const allTouched = new Set<string>();

    if (!passengerForm.name?.trim()) {
      newErrors.name = "Passenger name is required";
      allTouched.add("name");
    }
    if (!passengerForm.flightId) {
      newErrors.flightId = "Flight selection is required";
      allTouched.add("flightId");
    }
    if (!passengerForm.passport?.number?.trim()) {
      newErrors.passport = "Passport number is required";
      allTouched.add("passport");
    }
    if (!passengerForm.address?.trim()) {
      newErrors.address = "Address is required";
      allTouched.add("address");
    }
    if (!passengerForm.dateOfBirth?.trim()) {
      newErrors.dateOfBirth = "Date of birth is required";
      allTouched.add("dateOfBirth");
    }
    if (!passengerForm.seat?.trim()) {
      newErrors.seat = "Seat number is required";
      allTouched.add("seat");
    }

    setErrors(newErrors);
    setTouched(allTouched);

    if (Object.keys(newErrors).length === 0) {
      onSave();
      setErrors({});
      setTouched(new Set());
    }
  };

  const handleClose = () => {
    setErrors({});
    setTouched(new Set());
    setSeatDialogOpen(false);
    onClose();
  };

  // Check if all required fields are filled for seat selection
  const isRequiredFieldsFilled = 
    passengerForm.name?.trim() &&
    passengerForm.flightId &&
    passengerForm.passport?.number?.trim() &&
    passengerForm.address?.trim() &&
    passengerForm.dateOfBirth?.trim();

  const handleOpenSeatDialog = () => {
    if (isRequiredFieldsFilled) {
      setSeatDialogOpen(true);
    }
  };

  const handleSelectSeat = (seat: string) => {
    onFormChange({ ...passengerForm, seat });
    if (touched.has("seat")) {
      const error = validateField("seat", seat);
      setErrors(prev => ({ ...prev, seat: error }));
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>{editMode ? "Edit Passenger" : "Add Passenger"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={{ xs: 12, sm: editMode ? 6 : 12 }}>
            <TextField
              fullWidth
              required
              label="Name"
              value={passengerForm.name}
              onChange={(e) => {
                onFormChange({ ...passengerForm, name: e.target.value });
                if (touched.has("name")) {
                  const error = validateField("name", e.target.value);
                  setErrors(prev => ({ ...prev, name: error }));
                }
              }}
              onBlur={() => handleBlur("name")}
              error={touched.has("name") && !!errors.name}
              helperText={touched.has("name") ? errors.name : ""}
            />
          </Grid>
          {!editMode && (
            <Grid size={{ xs: 12 }}>
              <FormControl fullWidth required error={touched.has("flightId") && !!errors.flightId}>
                <InputLabel>Flight</InputLabel>
                <Select
                  value={passengerForm.flightId}
                  label="Flight"
                  onChange={(e: SelectChangeEvent) => {
                    onFormChange({
                      ...passengerForm,
                      flightId: e.target.value,
                    });
                    if (touched.has("flightId")) {
                      const error = validateField("flightId", e.target.value);
                      setErrors(prev => ({ ...prev, flightId: error }));
                    }
                  }}
                  onBlur={() => handleBlur("flightId")}
                >
                  {flights.map((flight) => (
                    <MenuItem key={flight.id} value={flight.id}>
                      {flight.name || flight.flightNumber}
                    </MenuItem>
                  ))}
                </Select>
                {touched.has("flightId") && errors.flightId && (
                  <FormHelperText>{errors.flightId}</FormHelperText>
                )}
              </FormControl>
            </Grid>
          )}
          {editMode && (
            <>
              <Grid size={{ xs: 12, sm: 6 }}>
                <FormControl fullWidth required error={touched.has("flightId") && !!errors.flightId}>
                  <InputLabel>Flight</InputLabel>
                  <Select
                    value={passengerForm.flightId}
                    label="Flight"
                    onChange={(e: SelectChangeEvent) => {
                      onFormChange({
                        ...passengerForm,
                        flightId: e.target.value,
                      });
                      if (touched.has("flightId")) {
                        const error = validateField("flightId", e.target.value);
                        setErrors(prev => ({ ...prev, flightId: error }));
                      }
                    }}
                    onBlur={() => handleBlur("flightId")}
                  >
                    {flights.map((flight) => (
                      <MenuItem key={flight.id} value={flight.id}>
                        {flight.name || flight.flightNumber}
                      </MenuItem>
                    ))}
                  </Select>
                  {touched.has("flightId") && errors.flightId && (
                    <FormHelperText>{errors.flightId}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Box sx={{ 
                  p: 1.5, 
                  border: '1px solid #e0e0e0', 
                  borderRadius: 1,
                  backgroundColor: passengerForm.seat ? '#e8f5e9' : '#f5f5f5',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  height: '56px'
                }}>
                  <Typography variant="body2" fontWeight="bold">
                    {passengerForm.seat ? `Seat: ${passengerForm.seat}` : 'No seat'}
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AirlineSeatReclineNormalIcon />}
                    onClick={handleOpenSeatDialog}
                    disabled={!isRequiredFieldsFilled}
                  >
                    {passengerForm.seat ? 'Change' : 'Select'}
                  </Button>
                </Box>
              </Grid>
            </>
          )}

          <Grid size={12}>
            <Divider sx={{ my: 1 }}>
              <Typography variant="caption">Passport Details</Typography>
            </Divider>
          </Grid>

          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              required
              label="Passport Number"
              value={passengerForm.passport?.number || ""}
              onChange={(e) => {
                onFormChange({
                  ...passengerForm,
                  passport: {
                    number: e.target.value,
                    expiryDate: passengerForm.passport?.expiryDate || "",
                    country: passengerForm.passport?.country || "",
                  },
                });
                if (touched.has("passport")) {
                  const error = validateField("passport", e.target.value);
                  setErrors(prev => ({ ...prev, passport: error }));
                }
              }}
              onBlur={() => handleBlur("passport")}
              error={touched.has("passport") && !!errors.passport}
              helperText={touched.has("passport") ? errors.passport : ""}
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Expiry Date"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={passengerForm.passport?.expiryDate || ""}
              onChange={(e) =>
                onFormChange({
                  ...passengerForm,
                  passport: {
                    number: passengerForm.passport?.number || "",
                    expiryDate: e.target.value,
                    country: passengerForm.passport?.country || "",
                  },
                })
              }
            />
          </Grid>
          <Grid size={{ xs: 12, sm: 4 }}>
            <TextField
              fullWidth
              label="Country"
              value={passengerForm.passport?.country || ""}
              onChange={(e) =>
                onFormChange({
                  ...passengerForm,
                  passport: {
                    number: passengerForm.passport?.number || "",
                    expiryDate: passengerForm.passport?.expiryDate || "",
                    country: e.target.value,
                  },
                })
              }
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              required
              label="Address"
              multiline
              rows={2}
              value={passengerForm.address}
              onChange={(e) => {
                onFormChange({
                  ...passengerForm,
                  address: e.target.value,
                });
                if (touched.has("address")) {
                  const error = validateField("address", e.target.value);
                  setErrors(prev => ({ ...prev, address: error }));
                }
              }}
              onBlur={() => handleBlur("address")}
              error={touched.has("address") && !!errors.address}
              helperText={touched.has("address") ? errors.address : ""}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              required
              label="Date of Birth"
              type="date"
              InputLabelProps={{ shrink: true }}
              inputProps={{ max: new Date().toISOString().split('T')[0] }}
              value={passengerForm.dateOfBirth}
              onChange={(e) => {
                onFormChange({
                  ...passengerForm,
                  dateOfBirth: e.target.value,
                });
                if (touched.has("dateOfBirth")) {
                  const error = validateField("dateOfBirth", e.target.value);
                  setErrors(prev => ({ ...prev, dateOfBirth: error }));
                }
              }}
              onBlur={() => handleBlur("dateOfBirth")}
              error={touched.has("dateOfBirth") && !!errors.dateOfBirth}
              helperText={touched.has("dateOfBirth") ? errors.dateOfBirth : ""}
            />
          </Grid>

          <Grid size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              label="Booking Reference"
              value={passengerForm.bookingReference}
              onChange={(e) =>
                onFormChange({
                  ...passengerForm,
                  bookingReference: e.target.value.toUpperCase(),
                })
              }
              helperText="Format: 3 letters + 3-7 digits (e.g., ABC123, BKG1234567)"
              placeholder="BKG123456"
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
                  backgroundColor: passengerForm.seat ? '#e8f5e9' : '#f5f5f5',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2
                }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="body2" fontWeight="bold">
                        {passengerForm.seat ? `Selected Seat: ${passengerForm.seat}` : 'No seat selected'}
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
                      {passengerForm.seat ? 'Change Seat' : 'Select Seat'}
                    </Button>
                  </Box>
                  {touched.has("seat") && errors.seat && (
                    <Typography variant="caption" color="error">
                      {errors.seat}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </>
          )}

          <Grid size={12}>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={passengerForm.wheelchair}
                    onChange={(e) => {
                      const isWheelchair = e.target.checked;
                      let updatedServices = [
                        ...passengerForm.ancillaryServices,
                      ];

                      if (isWheelchair) {
                        if (
                          !updatedServices.includes("Wheelchair Assistance")
                        ) {
                          updatedServices.push("Wheelchair Assistance");
                        }
                      } else {
                        updatedServices = updatedServices.filter(
                          (s) => s !== "Wheelchair Assistance"
                        );
                      }

                      onFormChange({
                        ...passengerForm,
                        wheelchair: isWheelchair,
                        ancillaryServices: updatedServices,
                      });
                    }}
                  />
                }
                label="Wheelchair"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={passengerForm.infant}
                    onChange={(e) => {
                      const isInfant = e.target.checked;
                      let updatedServices = [
                        ...passengerForm.ancillaryServices,
                      ];

                      if (isInfant) {
                        if (!updatedServices.includes("Infant Care Kit")) {
                          updatedServices.push("Infant Care Kit");
                        }
                      } else {
                        updatedServices = updatedServices.filter(
                          (s) => s !== "Infant Care Kit"
                        );
                      }

                      onFormChange({
                        ...passengerForm,
                        infant: isInfant,
                        ancillaryServices: updatedServices,
                      });
                    }}
                  />
                }
                label="Infant"
              />
            </FormGroup>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant="contained">
          {editMode ? "Update" : "Add"}
        </Button>
      </DialogActions>

      {/* Seat Selection Dialog */}
      <SeatSelectionDialog
        open={seatDialogOpen}
        onClose={() => setSeatDialogOpen(false)}
        onSelectSeat={handleSelectSeat}
        selectedSeat={passengerForm.seat}
        flightId={passengerForm.flightId}
        flight={selectedFlight}
        allPassengers={allPassengers}
        currentPassengerId={passengerForm.id}
      />
    </Dialog>
  );
};

export default PassengerDialog;
