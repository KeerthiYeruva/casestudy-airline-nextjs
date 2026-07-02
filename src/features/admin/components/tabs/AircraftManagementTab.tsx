"use client";

import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import SaveIcon from "@mui/icons-material/Save";
import type { AircraftStatus, Flight } from "../../../../domain/flights/types";

interface AircraftDraft {
  aircraft: string;
  totalSeats: string;
  availableSeats: string;
  seatLayout: string;
  aircraftStatus: AircraftStatus;
}

interface AircraftManagementTabProps {
  flights: Flight[];
  onUpdateFlight: (id: string, updates: Partial<Flight>) => Promise<boolean>;
}

const aircraftStatuses: AircraftStatus[] = ["Active", "Maintenance", "Out of Service"];

const getSeatLayout = (flight: Flight) => {
  if (flight.seatLayout) return flight.seatLayout;
  return flight.totalSeats > 180 ? "Wide-body" : "Single aisle";
};

const getAircraftStatus = (flight: Flight): AircraftStatus => flight.aircraftStatus || "Active";

const getAircraftDraft = (flight: Flight): AircraftDraft => ({
  aircraft: flight.aircraft,
  totalSeats: String(flight.totalSeats),
  availableSeats: String(flight.availableSeats),
  seatLayout: getSeatLayout(flight),
  aircraftStatus: getAircraftStatus(flight),
});

const parsePositiveInteger = (value: string) => {
  const parsedValue = Number(value);
  return Number.isInteger(parsedValue) && parsedValue >= 0 ? parsedValue : null;
};

export default function AircraftManagementTab({ flights, onUpdateFlight }: AircraftManagementTabProps) {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));
  const [drafts, setDrafts] = useState<Record<string, AircraftDraft>>({});
  const [savingFlightId, setSavingFlightId] = useState<string | null>(null);
  const [showAllFlights, setShowAllFlights] = useState(false);
  const previewCount = 3;
  const visibleFlights = isCompact && !showAllFlights ? flights.slice(0, previewCount) : flights;
  const hiddenFlightCount = flights.length - visibleFlights.length;

  const getDraft = (flight: Flight) => drafts[flight.id] || getAircraftDraft(flight);

  const updateDraft = (flight: Flight, updates: Partial<AircraftDraft>) => {
    setDrafts((currentDrafts) => ({
      ...currentDrafts,
      [flight.id]: {
        ...getDraft(flight),
        ...updates,
      },
    }));
  };

  const handleSave = async (flight: Flight) => {
    const draft = getDraft(flight);
    const totalSeats = parsePositiveInteger(draft.totalSeats);
    const availableSeats = parsePositiveInteger(draft.availableSeats);

    if (!draft.aircraft.trim() || totalSeats === null || totalSeats === 0 || availableSeats === null) {
      return;
    }

    setSavingFlightId(flight.id);

    const success = await onUpdateFlight(flight.id, {
      aircraft: draft.aircraft.trim(),
      totalSeats,
      availableSeats,
      seatLayout: draft.seatLayout.trim(),
      aircraftStatus: draft.aircraftStatus,
    });

    setSavingFlightId(null);

    if (success) {
      setDrafts((currentDrafts) => {
        const nextDrafts = { ...currentDrafts };
        delete nextDrafts[flight.id];
        return nextDrafts;
      });
    }
  };

  if (flights.length === 0) {
    return <Alert severity="info">No aircraft are available to manage.</Alert>;
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Aircraft Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Manage aircraft model, capacity, seat layout, and operating status for scheduled flights.
        </Typography>
      </Box>

      {isCompact && flights.length > previewCount && (
        <Paper variant="outlined" sx={{ p: 1.25, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 1 }}>
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>Aircraft list</Typography>
            <Typography variant="caption" color="text.secondary">
              {showAllFlights ? `Showing all ${flights.length}` : `Showing first ${visibleFlights.length} of ${flights.length}`}
            </Typography>
          </Box>
        </Paper>
      )}

      {visibleFlights.map((flight, flightIndex) => {
        const draft = getDraft(flight);
        const totalSeats = parsePositiveInteger(draft.totalSeats);
        const availableSeats = parsePositiveInteger(draft.availableSeats);
        const isSaving = savingFlightId === flight.id;
        const isInvalid = !draft.aircraft.trim() || totalSeats === null || totalSeats === 0 || availableSeats === null;

        return (
          <Paper key={`${flight.id}-${flightIndex}`} variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
                <Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <FlightIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {flight.flightNumber}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {flight.origin} to {flight.destination} · {flight.date}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                  <Chip label={draft.aircraft || "Aircraft TBD"} size="small" variant="outlined" />
                  <Chip label={`${draft.totalSeats || 0} seats`} size="small" variant="outlined" />
                  <Chip label={draft.aircraftStatus} size="small" color={draft.aircraftStatus === "Active" ? "success" : "warning"} />
                </Stack>
              </Stack>

              <Grid container spacing={2} sx={{ alignItems: "center" }}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Aircraft"
                    value={draft.aircraft}
                    onChange={(event) => updateDraft(flight, { aircraft: event.target.value })}
                    size="small"
                    fullWidth
                    placeholder="A320"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    label="Capacity"
                    type="number"
                    value={draft.totalSeats}
                    onChange={(event) => updateDraft(flight, { totalSeats: event.target.value })}
                    size="small"
                    fullWidth
                    slotProps={{ htmlInput: { min: 1 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 2 }}>
                  <TextField
                    label="Available Seats"
                    type="number"
                    value={draft.availableSeats}
                    onChange={(event) => updateDraft(flight, { availableSeats: event.target.value })}
                    size="small"
                    fullWidth
                    slotProps={{ htmlInput: { min: 0 } }}
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <TextField
                    label="Seat Layout"
                    value={draft.seatLayout}
                    onChange={(event) => updateDraft(flight, { seatLayout: event.target.value })}
                    size="small"
                    fullWidth
                    placeholder="Single aisle"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Aircraft Status</InputLabel>
                    <Select
                      label="Aircraft Status"
                      value={draft.aircraftStatus}
                      inputProps={{ "aria-label": "Aircraft Status" }}
                      onChange={(event) => updateDraft(flight, { aircraftStatus: event.target.value as AircraftStatus })}
                    >
                      {aircraftStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, md: 1 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSave(flight)}
                    disabled={isSaving || isInvalid}
                    fullWidth
                  >
                    {isSaving ? "Saving" : "Save"}
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        );
      })}

      {flights.length > previewCount && (
        <Button variant="outlined" onClick={() => setShowAllFlights((showAll) => !showAll)}>
          {showAllFlights ? "Show fewer" : `Show ${hiddenFlightCount} more flights`}
        </Button>
      )}
    </Stack>
  );
}