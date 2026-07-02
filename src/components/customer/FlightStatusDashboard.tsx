"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Card,
  CardContent,
  Chip,
  Container,
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
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ScheduleIcon from "@mui/icons-material/Schedule";
import { useRealtimeUpdates } from "../../hooks/useRealtimeUpdates";
import useDataStore from "../../stores/useDataStore";
import ConnectionStatusChip from "../ui/ConnectionStatusChip";
import StatusChip from "../ui/StatusChip";
import type { Flight } from "../../types/flight";

type FlightStatusFilter = Flight["status"] | "All";

interface StatusFilters {
  query: string;
  status: FlightStatusFilter;
}

const flightStatuses: FlightStatusFilter[] = [
  "All",
  "On Time",
  "Delayed",
  "Boarding",
  "Departed",
  "Arrived",
  "Cancelled",
];

const normalize = (value: string) => value.toLowerCase().trim();

const getRoute = (flight: Flight) => `${flight.origin || flight.from || ""} ${flight.destination || flight.to || ""}`;

const matchesQuery = (flight: Flight, query: string) => {
  if (!query.trim()) return true;
  const searchable = `${flight.flightNumber} ${getRoute(flight)} ${flight.gate || ""} ${flight.terminal || ""}`;
  return normalize(searchable).includes(normalize(query));
};

export default function FlightStatusDashboard() {
  const { flights, fetchFlights } = useDataStore();
  const { isConnected } = useRealtimeUpdates();
  const [filters, setFilters] = useState<StatusFilters>({ query: "", status: "All" });
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current && flights.length === 0) {
      fetchFlights();
      hasFetchedRef.current = true;
    }
  }, [fetchFlights, flights.length]);

  const visibleFlights = useMemo(() => {
    return flights
      .filter((flight) => filters.status === "All" || flight.status === filters.status)
      .filter((flight) => matchesQuery(flight, filters.query))
      .sort((firstFlight, secondFlight) => `${firstFlight.date} ${firstFlight.departureTime}`.localeCompare(`${secondFlight.date} ${secondFlight.departureTime}`));
  }, [filters, flights]);

  const statusCounts = useMemo(() => {
    return flights.reduce<Record<Flight["status"], number>>(
      (counts, flight) => ({ ...counts, [flight.status]: counts[flight.status] + 1 }),
      {
        "On Time": 0,
        Delayed: 0,
        Boarding: 0,
        Departed: 0,
        Arrived: 0,
        Cancelled: 0,
      }
    );
  }, [flights]);

  const updateFilter = <Key extends keyof StatusFilters>(key: Key, value: StatusFilters[Key]) => {
    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between", mb: 0.5, flexWrap: "wrap" }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <ConnectingAirportsIcon color="primary" />
              <Typography variant="h4" component="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.75rem", sm: "2.25rem" } }}>
                Flight Status
              </Typography>
            </Stack>
            <ConnectionStatusChip isConnected={isConnected} />
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Track current flight status, gate assignments, terminals, and schedule details.
          </Typography>
        </Box>

        <Grid container spacing={1.5}>
          {flightStatuses.filter((status): status is Flight["status"] => status !== "All").map((status) => (
            <Grid key={status} size={{ xs: 6, sm: 4, md: 2 }}>
              <Paper variant="outlined" sx={{ p: 1.5, height: "100%" }}>
                <Typography variant="caption" color="text.secondary">{status}</Typography>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>{statusCounts[status]}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        <Paper elevation={3} sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 8 }}>
              <TextField
                label="Search flights"
                value={filters.query}
                onChange={(event) => updateFilter("query", event.target.value)}
                fullWidth
                placeholder="Flight number, city, gate, or terminal"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 4 }}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  label="Status"
                  value={filters.status}
                  inputProps={{ "aria-label": "Status" }}
                  onChange={(event) => updateFilter("status", event.target.value as FlightStatusFilter)}
                >
                  {flightStatuses.map((status) => (
                    <MenuItem key={status} value={status}>
                      {status}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Paper>

        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 800 }}>
            {visibleFlights.length} flight{visibleFlights.length === 1 ? "" : "s"}
          </Typography>

          {visibleFlights.length === 0 ? (
            <Alert severity="info">No flights match the current status filters.</Alert>
          ) : (
            <Grid container spacing={2}>
              {visibleFlights.map((flight) => (
                <Grid key={flight.id} size={{ xs: 12, md: 6, xl: 4 }}>
                  <Card variant="outlined" sx={{ height: "100%" }}>
                    <CardContent>
                      <Stack spacing={2}>
                        <Stack direction="row" spacing={1.5} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                          <Box>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>{flight.flightNumber}</Typography>
                            <Typography variant="body2" color="text.secondary">{flight.aircraft}</Typography>
                          </Box>
                          <StatusChip status={flight.status} />
                        </Stack>

                        <Grid container spacing={1.5}>
                          <Grid size={{ xs: 12 }}>
                            <Typography variant="caption" color="text.secondary">Route</Typography>
                            <Typography variant="body1" sx={{ fontWeight: 700 }}>
                              {flight.origin || flight.from} to {flight.destination || flight.to}
                            </Typography>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                              <FlightTakeoffIcon fontSize="small" color="primary" />
                              <Box>
                                <Typography variant="caption" color="text.secondary">Depart</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{flight.departureTime}</Typography>
                              </Box>
                            </Stack>
                          </Grid>
                          <Grid size={{ xs: 6 }}>
                            <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
                              <FlightLandIcon fontSize="small" color="primary" />
                              <Box>
                                <Typography variant="caption" color="text.secondary">Arrive</Typography>
                                <Typography variant="body2" sx={{ fontWeight: 700 }}>{flight.arrivalTime}</Typography>
                              </Box>
                            </Stack>
                          </Grid>
                        </Grid>

                        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                          <Chip icon={<ScheduleIcon />} label={flight.date} size="small" variant="outlined" />
                          <Chip label={`Gate ${flight.gate || "TBD"}`} size="small" variant="outlined" />
                          <Chip label={`Terminal ${flight.terminal || "TBD"}`} size="small" variant="outlined" />
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Stack>
      </Stack>
    </Container>
  );
}