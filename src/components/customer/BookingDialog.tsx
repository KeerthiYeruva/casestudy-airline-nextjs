"use client";

import React, { useMemo, useState } from "react";
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

const defaultForm: BookingForm = {
  name: "",
  dateOfBirth: "",
  address: "",
  specialMeal: "Regular",
};

const seatLetters = ["A", "B", "C", "D", "E", "F"];
const mealOptions = ["Regular", "Vegetarian", "Vegan", "Gluten-Free", "Kosher", "Halal"];

const getFirstAvailableSeat = (flight: Flight, passengers: Passenger[]) => {
  const occupiedSeats = new Set(passengers.filter((passenger) => passenger.flightId === flight.id).map((passenger) => passenger.seat));
  const totalRows = Math.max(1, Math.ceil(flight.totalSeats / seatLetters.length));

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

const createBookingReference = (name: string, flight: Flight, passengerCount: number) => {
  const letters = name.replace(/[^a-z]/gi, "").toUpperCase().padEnd(3, "X").slice(0, 3);
  const flightDigits = flight.flightNumber.replace(/\D/g, "").padStart(3, "0").slice(-3);
  return `${letters}${flightDigits}${passengerCount}`.slice(0, 10);
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

  const suggestedSeat = useMemo(() => (flight ? getFirstAvailableSeat(flight, passengers) : null), [flight, passengers]);

  const resetAndClose = () => {
    setForm(defaultForm);
    setConfirmation(null);
    setError(null);
    setIsSubmitting(false);
    onClose();
  };

  const updateForm = <Key extends keyof BookingForm>(key: Key, value: BookingForm[Key]) => {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  };

  const handleCreateBooking = async () => {
    if (!flight || !suggestedSeat) return;

    if (!form.name.trim()) {
      setError("Passenger name is required.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const createdPassenger = await onCreateBooking({
      name: form.name.trim(),
      seat: suggestedSeat,
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
                  <Chip icon={<EventSeatIcon />} label={`Seat ${suggestedSeat || "TBD"}`} />
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
            disabled={isSubmitting || !suggestedSeat}
          >
            {isSubmitting ? "Creating" : "Confirm Booking"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}