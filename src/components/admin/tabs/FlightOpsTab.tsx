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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightDialog from "@/components/admin/FlightDialog";
import StatusChip from "../../ui/StatusChip";
import type { Flight } from "@/types/flight";

type FlightStatus = Flight["status"];

interface FlightOpsDraft {
  status: FlightStatus;
  gate: string;
  terminal: string;
}

interface FlightOpsTabProps {
  flights: Flight[];
  onAddFlight: (flight: Partial<Flight>) => Promise<boolean>;
  onUpdateFlight: (id: string, updates: Partial<Flight>) => Promise<boolean>;
  onDeleteFlight: (id: string) => Promise<boolean>;
}

const flightStatuses: FlightStatus[] = [
  "On Time",
  "Delayed",
  "Boarding",
  "Departed",
  "Arrived",
  "Cancelled",
];

const getFlightDraft = (flight: Flight): FlightOpsDraft => ({
  status: flight.status,
  gate: flight.gate || "",
  terminal: flight.terminal || "",
});

const FlightOpsTab: React.FC<FlightOpsTabProps> = ({ flights, onAddFlight, onUpdateFlight, onDeleteFlight }) => {
  const [drafts, setDrafts] = useState<Record<string, FlightOpsDraft>>({});
  const [savingFlightId, setSavingFlightId] = useState<string | null>(null);
  const [flightDialogOpen, setFlightDialogOpen] = useState(false);
  const [deletingFlightId, setDeletingFlightId] = useState<string | null>(null);

  const getDraft = (flight: Flight) => drafts[flight.id] || getFlightDraft(flight);

  const updateDraft = (flight: Flight, updates: Partial<FlightOpsDraft>) => {
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
    setSavingFlightId(flight.id);

    const success = await onUpdateFlight(flight.id, {
      status: draft.status,
      gate: draft.gate.trim(),
      terminal: draft.terminal.trim(),
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

  const handleDelete = async (flight: Flight) => {
    if (!window.confirm(`Delete flight ${flight.flightNumber}? Associated passengers will also be removed.`)) return;

    setDeletingFlightId(flight.id);
    await onDeleteFlight(flight.id);
    setDeletingFlightId(null);
  };

  return (
    <Stack spacing={2.5}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between", alignItems: { xs: "stretch", sm: "flex-start" } }}>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Flight Status & Gates
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Create flights and update operational status, assigned gate, and terminal for staff-facing views.
          </Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => setFlightDialogOpen(true)}>
          Create Flight
        </Button>
      </Stack>

      {flights.length === 0 && <Alert severity="info">No flights are available to manage.</Alert>}

      {flights.map((flight) => {
        const draft = getDraft(flight);
        const isSaving = savingFlightId === flight.id;
        const isDeleting = deletingFlightId === flight.id;

        return (
          <Paper key={flight.id} variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack spacing={2}>
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                sx={{
                  justifyContent: "space-between",
                  alignItems: { xs: "flex-start", sm: "center" },
                }}
              >
                <Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <FlightTakeoffIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {flight.flightNumber}
                    </Typography>
                    <StatusChip status={flight.status} />
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {flight.origin} to {flight.destination} · {flight.departureTime}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap" }}>
                  <Chip label={`Gate ${flight.gate || "TBD"}`} size="small" variant="outlined" />
                  <Chip label={`Terminal ${flight.terminal || "TBD"}`} size="small" variant="outlined" />
                  <Button
                    color="error"
                    variant="outlined"
                    size="small"
                    startIcon={<DeleteIcon />}
                    onClick={() => handleDelete(flight)}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting" : "Delete"}
                  </Button>
                </Stack>
              </Stack>

              <Grid container spacing={2} sx={{ alignItems: "center" }}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <FormControl fullWidth size="small">
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      value={draft.status}
                      onChange={(event) => updateDraft(flight, { status: event.target.value as FlightStatus })}
                    >
                      {flightStatuses.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    label="Gate"
                    value={draft.gate}
                    onChange={(event) => updateDraft(flight, { gate: event.target.value })}
                    size="small"
                    fullWidth
                    placeholder="A12"
                  />
                </Grid>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <TextField
                    label="Terminal"
                    value={draft.terminal}
                    onChange={(event) => updateDraft(flight, { terminal: event.target.value })}
                    size="small"
                    fullWidth
                    placeholder="1"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSave(flight)}
                    disabled={isSaving || !draft.gate.trim() || !draft.terminal.trim()}
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

      <FlightDialog open={flightDialogOpen} onClose={() => setFlightDialogOpen(false)} onSave={onAddFlight} />
    </Stack>
  );
};

export default FlightOpsTab;