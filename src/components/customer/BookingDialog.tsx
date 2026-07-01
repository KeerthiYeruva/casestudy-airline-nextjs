"use client";

import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import type { Flight } from "@/types/flight";
import type { Passenger } from "@/types/passenger";

type CabinClass = "Economy" | "Premium Economy" | "Business" | "First";

interface BookingDialogProps {
  open: boolean;
  flight: Flight | null;
  cabinClass: CabinClass;
  passengerCount: number;
  passengers: Passenger[];
  onClose: () => void;
  onCreateBooking: (passenger: Omit<Passenger, "id">) => Promise<Passenger | null>;
}

interface BookingForm {
  name: string;
  dateOfBirth: string;
  address: string;
  specialMeal: string;
}

interface PaymentForm {
  cardholderName: string;
  cardNumber: string;
  expiryDate: string;
  securityCode: string;
}

const defaultForm: BookingForm = {
  name: "",
  dateOfBirth: "",
  address: "",
  specialMeal: "Regular",
};

const defaultPaymentForm: PaymentForm = {
  cardholderName: "",
  cardNumber: "",
  expiryDate: "",
  securityCode: "",
};

const seatLetters = ["A", "B", "C", "D", "E", "F"];
const mealOptions = ["Regular", "Vegetarian", "Vegan", "Gluten-Free", "Kosher", "Halal"];

const getOccupiedSeats = (flight: Flight, passengers: Passenger[]) => {
  return new Set(passengers.filter((passenger) => passenger.flightId === flight.id).map((passenger) => passenger.seat));
};

const getSeatRows = (flight: Flight) => Math.max(1, Math.ceil(flight.totalSeats / seatLetters.length));

const getFirstAvailableSeat = (flight: Flight, occupiedSeats: Set<string>) => {
  const totalRows = getSeatRows(flight);

  for (let row = 1; row <= totalRows; row += 1) {
    for (const letter of seatLetters) {
      const seat = `${row}${letter}`;
      if (!occupiedSeats.has(seat)) {
        return seat;
      }
    }
  }

  return null;
};

const getSeatGrid = (flight: Flight) => {
  const totalRows = Math.max(1, Math.ceil(flight.totalSeats / seatLetters.length));
  return Array.from({ length: totalRows }, (_, rowIndex) => rowIndex + 1);
};

const isPremiumSeat = (seat: string) => {
  const row = Number(seat.match(/^\d+/)?.[0] || 0);
  return row > 0 && row <= 3;
};

const getSeatButtonTone = (seat: string, selectedSeat: string | null, occupiedSeats: Set<string>) => {
  if (occupiedSeats.has(seat)) return "inherit";
  if (selectedSeat === seat) return "primary";
  if (isPremiumSeat(seat)) return "warning";
  return "primary";
};

const SeatSelector = ({
  flight,
  selectedSeat,
  occupiedSeats,
  onSelectSeat,
}: {
  flight: Flight;
  selectedSeat: string | null;
  occupiedSeats: Set<string>;
  onSelectSeat: (seat: string) => void;
}) => {
  const rows = getSeatGrid(flight);

  return (
    <Paper variant="outlined" sx={{ p: 2 }}>
      <Stack spacing={1.5}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ justifyContent: "space-between" }}>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              Choose Seat
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Select an available seat before confirming your booking.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            <Chip label="Available" size="small" variant="outlined" />
            <Chip label="Premium rows 1-3" size="small" color="warning" variant="outlined" />
            <Chip label="Occupied" size="small" color="default" />
          </Stack>
        </Stack>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="caption" sx={{ px: 2, py: 0.5, bgcolor: "primary.main", color: "primary.contrastText", borderRadius: 1 }}>
            FRONT OF AIRCRAFT
          </Typography>
        </Box>

        <Box sx={{ maxHeight: 320, overflow: "auto", border: "1px solid", borderColor: "divider", borderRadius: 1, p: 1.5 }}>
          <Stack spacing={0.75}>
            {rows.map((row) => (
              <Stack key={row} direction="row" spacing={0.75} sx={{ alignItems: "center", justifyContent: "center" }}>
                <Typography variant="caption" sx={{ width: 24, textAlign: "right", color: "text.secondary", fontWeight: 700 }}>
                  {row}
                </Typography>
                {seatLetters.map((letter, index) => {
                  const seat = `${row}${letter}`;
                  const isOccupied = occupiedSeats.has(seat);
                  const isSelected = selectedSeat === seat;

                  return (
                    <React.Fragment key={seat}>
                      <Button
                        aria-label={`Seat ${seat}`}
                        variant={isSelected ? "contained" : "outlined"}
                        color={getSeatButtonTone(seat, selectedSeat, occupiedSeats)}
                        disabled={isOccupied}
                        onClick={() => onSelectSeat(seat)}
                        sx={{ minWidth: 44, width: 44, height: 36, p: 0, fontSize: "0.75rem", fontWeight: 800 }}
                      >
                        {seat}
                      </Button>
                      {index === 2 && <Box sx={{ width: 20 }} />}
                    </React.Fragment>
                  );
                })}
              </Stack>
            ))}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
};

const createBookingReference = (name: string, flight: Flight, passengerCount: number) => {
  const letters = name.replace(/[^a-z]/gi, "").toUpperCase().padEnd(3, "X").slice(0, 3);
  const flightDigits = flight.flightNumber.replace(/\D/g, "").padStart(3, "0").slice(-3);
  return `${letters}${flightDigits}${passengerCount}`.slice(0, 10);
};

const getCabinPrice = (cabinClass: CabinClass) => {
  if (cabinClass === "First") return 1249;
  if (cabinClass === "Business") return 849;
  if (cabinClass === "Premium Economy") return 429;
  return 249;
};

const getFormattedCardNumber = (value: string) => {
  return value.replace(/\D/g, "").slice(0, 16).replace(/(\d{4})(?=\d)/g, "$1 ");
};

const getFormattedExpiryDate = (value: string) => {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
};

export default function BookingDialog({
  open,
  flight,
  cabinClass,
  passengerCount,
  passengers,
  onClose,
  onCreateBooking,
}: BookingDialogProps) {
  const [form, setForm] = useState<BookingForm>(defaultForm);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Passenger | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSeat, setSelectedSeat] = useState<string | null>(null);
  const [paymentForm, setPaymentForm] = useState<PaymentForm>(defaultPaymentForm);

  const occupiedSeats = useMemo(() => (flight ? getOccupiedSeats(flight, passengers) : new Set<string>()), [flight, passengers]);
  const suggestedSeat = useMemo(() => (flight ? getFirstAvailableSeat(flight, occupiedSeats) : null), [flight, occupiedSeats]);
  const totalPrice = getCabinPrice(cabinClass) * passengerCount;
  const isPaymentComplete =
    paymentForm.cardholderName.trim().length > 0 &&
    paymentForm.cardNumber.replace(/\s/g, "").length === 16 &&
    /^\d{2}\/\d{2}$/.test(paymentForm.expiryDate) &&
    paymentForm.securityCode.length >= 3;

  useEffect(() => {
    setSelectedSeat(suggestedSeat);
  }, [suggestedSeat]);

  const resetAndClose = () => {
    setForm(defaultForm);
    setConfirmation(null);
    setError(null);
    setIsSubmitting(false);
    setSelectedSeat(null);
    setPaymentForm(defaultPaymentForm);
    onClose();
  };

  const updateForm = <Key extends keyof BookingForm>(key: Key, value: BookingForm[Key]) => {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  };

  const updatePaymentForm = <Key extends keyof PaymentForm>(key: Key, value: PaymentForm[Key]) => {
    setPaymentForm((currentForm) => ({ ...currentForm, [key]: value }));
  };

  const handleCreateBooking = async () => {
    if (!flight || !selectedSeat) return;

    if (!form.name.trim()) {
      setError("Passenger name is required.");
      return;
    }

    if (occupiedSeats.has(selectedSeat)) {
      setError(`Seat ${selectedSeat} is no longer available. Please choose another seat.`);
      return;
    }

    if (!isPaymentComplete) {
      setError("Complete payment details before confirming your booking.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const createdPassenger = await onCreateBooking({
      name: form.name.trim(),
      seat: selectedSeat,
      flightId: flight.id,
      passport: { number: "", expiryDate: "", country: "" },
      address: form.address.trim(),
      dateOfBirth: form.dateOfBirth,
      ancillaryServices: cabinClass === "Business" || cabinClass === "First" ? ["Priority Boarding"] : [],
      specialMeal: form.specialMeal,
      wheelchair: false,
      infant: false,
      checkedIn: false,
      bookingReference: createBookingReference(form.name, flight, passengers.length + 1),
      shopRequests: [],
      premiumUpgrade: cabinClass !== "Economy",
    });

    setIsSubmitting(false);

    if (createdPassenger) {
      setConfirmation(createdPassenger);
    } else {
      setError("Booking could not be created. Please try another flight or seat.");
    }
  };

  return (
    <Dialog open={open} onClose={resetAndClose} fullWidth maxWidth="md">
      <DialogTitle>{confirmation ? "Booking Confirmed" : `Book ${flight?.flightNumber || "Flight"}`}</DialogTitle>
      <DialogContent dividers>
        {!flight ? (
          <Alert severity="info">Select a flight to begin booking.</Alert>
        ) : confirmation ? (
          <Stack spacing={2.5}>
            <Alert icon={<CheckCircleIcon />} severity="success">
              Booking created for {confirmation.name}.
            </Alert>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6 }}>
                  <Typography variant="caption" color="text.secondary">Booking Reference</Typography>
                  <Typography variant="h5" sx={{ fontWeight: 800 }}>{confirmation.bookingReference}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">Seat</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{confirmation.seat}</Typography>
                </Grid>
                <Grid size={{ xs: 6, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">Cabin</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{cabinClass}</Typography>
                </Grid>
                <Grid size={{ xs: 12, sm: 3 }}>
                  <Typography variant="caption" color="text.secondary">Paid</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>${totalPrice.toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </Paper>
          </Stack>
        ) : (
          <Stack spacing={2.5}>
            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 800 }}>{flight.flightNumber}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.origin} to {flight.destination} · {flight.date} · {flight.departureTime}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                  <Chip icon={<EventSeatIcon />} label={`Seat ${selectedSeat || "TBD"}`} />
                  <Chip label={cabinClass} variant="outlined" />
                  <Chip label={`${passengerCount} passenger${passengerCount === 1 ? "" : "s"}`} variant="outlined" />
                </Stack>
              </Stack>
            </Paper>

            {passengerCount > 1 && (
              <Alert severity="info">
                Phase 1 creates the lead passenger booking. Multi-passenger booking details can build on this flow next.
              </Alert>
            )}

            {!suggestedSeat && <Alert severity="warning">No seats are currently available for this flight.</Alert>}
            {error && <Alert severity="error">{error}</Alert>}

            <SeatSelector
              flight={flight}
              selectedSeat={selectedSeat}
              occupiedSeats={occupiedSeats}
              onSelectSeat={setSelectedSeat}
            />

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Passenger Name"
                  value={form.name}
                  onChange={(event) => updateForm("name", event.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  label="Date of Birth"
                  type="date"
                  value={form.dateOfBirth}
                  onChange={(event) => updateForm("dateOfBirth", event.target.value)}
                  fullWidth
                  slotProps={{ inputLabel: { shrink: true } }}
                />
              </Grid>
              <Grid size={{ xs: 12, md: 8 }}>
                <TextField
                  label="Address"
                  value={form.address}
                  onChange={(event) => updateForm("address", event.target.value)}
                  fullWidth
                />
              </Grid>
              <Grid size={{ xs: 12, md: 4 }}>
                <TextField
                  select
                  label="Meal Preference"
                  value={form.specialMeal}
                  onChange={(event) => updateForm("specialMeal", event.target.value)}
                  fullWidth
                >
                  {mealOptions.map((meal) => (
                    <MenuItem key={meal} value={meal}>{meal}</MenuItem>
                  ))}
                </TextField>
              </Grid>
            </Grid>

            <Paper variant="outlined" sx={{ p: 2 }}>
              <Stack spacing={2}>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={1} sx={{ justifyContent: "space-between" }}>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
                      Payment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Secure mock checkout for this booking.
                    </Typography>
                  </Box>
                  <Chip label={`Total $${totalPrice.toLocaleString()}`} color="success" />
                </Stack>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Cardholder Name"
                      value={paymentForm.cardholderName}
                      onChange={(event) => updatePaymentForm("cardholderName", event.target.value)}
                      fullWidth
                      required
                    />
                  </Grid>
                  <Grid size={{ xs: 12, md: 6 }}>
                    <TextField
                      label="Card Number"
                      value={paymentForm.cardNumber}
                      onChange={(event) => updatePaymentForm("cardNumber", getFormattedCardNumber(event.target.value))}
                      fullWidth
                      required
                      slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 19 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <TextField
                      label="Expiry Date"
                      placeholder="MM/YY"
                      value={paymentForm.expiryDate}
                      onChange={(event) => updatePaymentForm("expiryDate", getFormattedExpiryDate(event.target.value))}
                      fullWidth
                      required
                      slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 5 } }}
                    />
                  </Grid>
                  <Grid size={{ xs: 6, md: 3 }}>
                    <TextField
                      label="Security Code"
                      value={paymentForm.securityCode}
                      onChange={(event) => updatePaymentForm("securityCode", event.target.value.replace(/\D/g, "").slice(0, 4))}
                      fullWidth
                      required
                      slotProps={{ htmlInput: { inputMode: "numeric", maxLength: 4 } }}
                    />
                  </Grid>
                </Grid>
              </Stack>
            </Paper>

            <Divider />
            <Typography variant="body2" color="text.secondary">
              The passenger will appear in staff check-in as not checked in, with a generated booking reference and assigned seat.
            </Typography>
          </Stack>
        )}
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={resetAndClose}>{confirmation ? "Close" : "Cancel"}</Button>
        {!confirmation && flight && (
          <Button
            variant="contained"
            onClick={handleCreateBooking}
            disabled={isSubmitting || !selectedSeat || !isPaymentComplete}
          >
            {isSubmitting ? "Creating" : "Confirm Booking"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}