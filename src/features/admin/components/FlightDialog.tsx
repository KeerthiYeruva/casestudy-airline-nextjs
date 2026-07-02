"use client";

import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import type { Flight } from "../../../domain/flights/types";

type FlightStatus = Flight["status"];

type FlightFormState = {
  name: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  status: FlightStatus;
  aircraft: string;
  gate: string;
  terminal: string;
  totalSeats: string;
  availableSeats: string;
};

interface FlightDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (flight: Partial<Flight>) => Promise<boolean>;
}

const flightStatuses: FlightStatus[] = ["On Time", "Delayed", "Boarding", "Departed", "Arrived", "Cancelled"];

const defaultForm: FlightFormState = {
  name: "",
  flightNumber: "",
  origin: "",
  destination: "",
  departureTime: "09:00 AM",
  arrivalTime: "12:00 PM",
  date: "",
  status: "On Time",
  aircraft: "",
  gate: "",
  terminal: "",
  totalSeats: "180",
  availableSeats: "180",
};

const parseSeatCount = (value: string) => {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue >= 0 ? parsedValue : null;
};

export default function FlightDialog({ open, onClose, onSave }: FlightDialogProps) {
  const [form, setForm] = useState<FlightFormState>(defaultForm);
  const [saving, setSaving] = useState(false);

  const handleClose = () => {
    setForm(defaultForm);
    onClose();
  };

  const updateForm = <Key extends keyof FlightFormState>(key: Key, value: FlightFormState[Key]) => {
    setForm((currentForm) => ({ ...currentForm, [key]: value }));
  };

  const totalSeats = parseSeatCount(form.totalSeats);
  const availableSeats = parseSeatCount(form.availableSeats);
  const isInvalid =
    !form.name.trim() ||
    !form.flightNumber.trim() ||
    !form.origin.trim() ||
    !form.destination.trim() ||
    !form.departureTime.trim() ||
    !form.arrivalTime.trim() ||
    !form.date.trim() ||
    !form.aircraft.trim() ||
    !form.gate.trim() ||
    !form.terminal.trim() ||
    totalSeats === null ||
    totalSeats === 0 ||
    availableSeats === null ||
    availableSeats > totalSeats;

  const handleSave = async () => {
    if (isInvalid || totalSeats === null || availableSeats === null) return;

    setSaving(true);
    const success = await onSave({
      name: form.name.trim(),
      flightNumber: form.flightNumber.trim().toUpperCase(),
      origin: form.origin.trim(),
      destination: form.destination.trim(),
      from: form.origin.trim(),
      to: form.destination.trim(),
      departureTime: form.departureTime.trim(),
      arrivalTime: form.arrivalTime.trim(),
      time: form.departureTime.trim(),
      date: form.date,
      status: form.status,
      aircraft: form.aircraft.trim(),
      gate: form.gate.trim(),
      terminal: form.terminal.trim(),
      totalSeats,
      availableSeats,
      aircraftStatus: "Active",
    });
    setSaving(false);

    if (success) {
      handleClose();
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md">
      <DialogTitle>Create Flight</DialogTitle>
      <DialogContent>
        <Stack spacing={2.5} sx={{ pt: 1 }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Flight Name" value={form.name} onChange={(event) => updateForm("name", event.target.value)} fullWidth placeholder="Morning Transcontinental" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Flight Number" value={form.flightNumber} onChange={(event) => updateForm("flightNumber", event.target.value.toUpperCase())} fullWidth placeholder="AA101" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Origin" value={form.origin} onChange={(event) => updateForm("origin", event.target.value)} fullWidth placeholder="New York (JFK)" />
            </Grid>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField label="Destination" value={form.destination} onChange={(event) => updateForm("destination", event.target.value)} fullWidth placeholder="Los Angeles (LAX)" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField label="Date" type="date" value={form.date} onChange={(event) => updateForm("date", event.target.value)} fullWidth slotProps={{ inputLabel: { shrink: true } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField label="Departure" value={form.departureTime} onChange={(event) => updateForm("departureTime", event.target.value)} fullWidth placeholder="09:00 AM" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField label="Arrival" value={form.arrivalTime} onChange={(event) => updateForm("arrivalTime", event.target.value)} fullWidth placeholder="12:00 PM" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select label="Status" value={form.status} onChange={(event) => updateForm("status", event.target.value as FlightStatus)}>
                  {flightStatuses.map((status) => (
                    <MenuItem key={status} value={status}>{status}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <TextField label="Aircraft" value={form.aircraft} onChange={(event) => updateForm("aircraft", event.target.value)} fullWidth placeholder="Boeing 737" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField label="Gate" value={form.gate} onChange={(event) => updateForm("gate", event.target.value)} fullWidth placeholder="A12" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField label="Terminal" value={form.terminal} onChange={(event) => updateForm("terminal", event.target.value)} fullWidth placeholder="4" />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField label="Capacity" type="number" value={form.totalSeats} onChange={(event) => updateForm("totalSeats", event.target.value)} fullWidth slotProps={{ htmlInput: { min: 1 } }} />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField label="Available" type="number" value={form.availableSeats} onChange={(event) => updateForm("availableSeats", event.target.value)} fullWidth slotProps={{ htmlInput: { min: 0 } }} />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave} disabled={saving || isInvalid}>
          {saving ? "Creating" : "Create Flight"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}