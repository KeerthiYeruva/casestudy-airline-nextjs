"use client";

import React, { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import SaveIcon from "@mui/icons-material/Save";
import type { CrewAssignment, Flight } from "../../../../domain/flights/types";

interface CrewDraft {
  pilot: string;
  coPilot: string;
  cabinCrew: string;
}

interface CrewManagementTabProps {
  flights: Flight[];
  onUpdateFlight: (id: string, updates: Partial<Flight>) => Promise<boolean>;
}

const getCrewDraft = (flight: Flight): CrewDraft => ({
  pilot: flight.crew?.pilot || "",
  coPilot: flight.crew?.coPilot || "",
  cabinCrew: flight.crew?.cabinCrew.join("\n") || "",
});

const parseCabinCrew = (value: string) => {
  return value
    .split(/[\n,]/)
    .map((crewMember) => crewMember.trim())
    .filter(Boolean);
};

const toCrewAssignment = (draft: CrewDraft): CrewAssignment => ({
  pilot: draft.pilot.trim(),
  coPilot: draft.coPilot.trim(),
  cabinCrew: parseCabinCrew(draft.cabinCrew),
});

export default function CrewManagementTab({ flights, onUpdateFlight }: CrewManagementTabProps) {
  const [drafts, setDrafts] = useState<Record<string, CrewDraft>>({});
  const [savingFlightId, setSavingFlightId] = useState<string | null>(null);

  const getDraft = (flight: Flight) => drafts[flight.id] || getCrewDraft(flight);

  const updateDraft = (flight: Flight, updates: Partial<CrewDraft>) => {
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
    const crew = toCrewAssignment(draft);
    setSavingFlightId(flight.id);

    const success = await onUpdateFlight(flight.id, { crew });

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
    return <Alert severity="info">No flights are available for crew assignment.</Alert>;
  }

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h6" sx={{ fontWeight: 700 }}>
          Crew Management
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Assign pilots, co-pilots, and cabin crew to scheduled flights.
        </Typography>
      </Box>

      {flights.map((flight, flightIndex) => {
        const draft = getDraft(flight);
        const cabinCrew = parseCabinCrew(draft.cabinCrew);
        const isSaving = savingFlightId === flight.id;

        return (
          <Paper key={`${flight.id}-${flightIndex}`} variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
            <Stack spacing={2}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
                <Box>
                  <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                    <GroupsIcon color="primary" fontSize="small" />
                    <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                      {flight.flightNumber}
                    </Typography>
                  </Stack>
                  <Typography variant="body2" color="text.secondary">
                    {flight.origin} to {flight.destination} · {flight.date} · {flight.aircraft}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                  <Chip label={draft.pilot.trim() || "Pilot TBD"} size="small" variant="outlined" />
                  <Chip label={`${cabinCrew.length} cabin crew`} size="small" variant="outlined" />
                </Stack>
              </Stack>

              <Grid container spacing={2} sx={{ alignItems: "flex-start" }}>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Pilot"
                    value={draft.pilot}
                    onChange={(event) => updateDraft(flight, { pilot: event.target.value })}
                    size="small"
                    fullWidth
                    placeholder="Captain name"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 3 }}>
                  <TextField
                    label="Co-Pilot"
                    value={draft.coPilot}
                    onChange={(event) => updateDraft(flight, { coPilot: event.target.value })}
                    size="small"
                    fullWidth
                    placeholder="First officer name"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  <TextField
                    label="Cabin Crew"
                    value={draft.cabinCrew}
                    onChange={(event) => updateDraft(flight, { cabinCrew: event.target.value })}
                    size="small"
                    fullWidth
                    multiline
                    minRows={2}
                    placeholder="One name per line or comma separated"
                  />
                </Grid>
                <Grid size={{ xs: 12, md: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<SaveIcon />}
                    onClick={() => handleSave(flight)}
                    disabled={isSaving || !draft.pilot.trim() || !draft.coPilot.trim() || cabinCrew.length === 0}
                    fullWidth
                  >
                    {isSaving ? "Saving" : "Save Crew"}
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </Paper>
        );
      })}
    </Stack>
  );
}