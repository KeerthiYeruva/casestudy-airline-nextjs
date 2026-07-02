"use client";

import React, { useEffect, useRef } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import ConnectingAirportsIcon from "@mui/icons-material/ConnectingAirports";
import DashboardIcon from "@mui/icons-material/Dashboard";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import useDataStore from "../../../stores/useDataStore";
import useRealtimeUpdates from "../../../hooks/useRealtimeUpdates";
import { UserRole, roleLabels } from "../../../domain/auth/types";
import type { Flight } from "../../../domain/flights/types";
import type { Passenger } from "../../../domain/passengers/types";
import PageHeader from "../../../shared/components/ui/PageHeader";
import StatusChip from "../../../shared/components/ui/StatusChip";
import { getSeatRecommendations } from "../../seating/utils/seatRecommendations";

type DashboardView = "checkin" | "inflight" | "seatMap" | "status";

interface OperationalDashboardProps {
  role: UserRole;
  onOpenView: (view: DashboardView) => void;
}

interface MetricCardProps {
  label: string;
  value: string;
  helper: string;
  icon: React.ReactNode;
  tone: "primary" | "success" | "info" | "warning" | "error" | "secondary";
}

const formatPercent = (value: number) => {
  if (!Number.isFinite(value)) return "0%";
  return `${Math.round(value)}%`;
};

const getFlightPassengers = (flight: Flight, passengers: Passenger[]) => {
  return passengers.filter((passenger) => passenger.flightId === flight.id);
};

const getFlightPriority = (flight: Flight) => {
  if (flight.status === "Boarding") return 0;
  if (flight.status === "Delayed") return 1;
  if (flight.status === "On Time") return 2;
  if (flight.status === "Departed") return 3;
  return 4;
};

function MetricCard({ label, value, helper, icon, tone }: MetricCardProps) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 2,
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        display: "flex",
        gap: 1.5,
        alignItems: "flex-start",
      }}
    >
      <Box
        sx={{
          width: 42,
          height: 42,
          borderRadius: 2,
          display: "grid",
          placeItems: "center",
          bgcolor: `${tone}.50`,
          color: `${tone}.main`,
          flexShrink: 0,
        }}
      >
        {icon}
      </Box>
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h5" sx={{ fontWeight: 750, lineHeight: 1.25 }}>
          {value}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {helper}
        </Typography>
      </Box>
    </Paper>
  );
}

export default function OperationalDashboard({ role, onOpenView }: OperationalDashboardProps) {
  const { flights, passengers, fetchFlights, fetchPassengers } = useDataStore();
  const { isConnected } = useRealtimeUpdates();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      if (flights.length === 0) {
        fetchFlights();
      }
      if (passengers.length === 0) {
        fetchPassengers();
      }
      hasFetchedRef.current = true;
    }
  }, [fetchFlights, fetchPassengers, flights.length, passengers.length]);

  const activeFlights = flights
    .filter((flight) => !["Arrived", "Cancelled"].includes(flight.status))
    .sort((firstFlight, secondFlight) => getFlightPriority(firstFlight) - getFlightPriority(secondFlight));
  const primaryFlight = activeFlights[0] ?? flights[0] ?? null;
  const primaryFlightPassengers = primaryFlight ? getFlightPassengers(primaryFlight, passengers) : [];
  const checkedInPassengers = primaryFlightPassengers.filter((passenger) => passenger.checkedIn).length;
  const boardingRate = primaryFlightPassengers.length > 0 ? (checkedInPassengers / primaryFlightPassengers.length) * 100 : 0;
  const pendingCheckIn = passengers.filter((passenger) => !passenger.checkedIn).length;
  const serviceQueue = passengers.filter(
    (passenger) => passenger.ancillaryServices.length > 0 || (passenger.shopRequests?.length ?? 0) > 0 || passenger.specialMeal !== "Regular"
  );
  const assistanceQueue = passengers.filter((passenger) => passenger.wheelchair || passenger.infant);
  const seatingExceptions = activeFlights.flatMap((flight, flightIndex) =>
    getSeatRecommendations(getFlightPassengers(flight, passengers)).map((exception) => ({
      ...exception,
      id: `${flight.id}-${flightIndex}-${exception.id}`,
    }))
  );
  const delayedFlights = activeFlights.filter((flight) => flight.status === "Delayed");
  const boardingFlights = activeFlights.filter((flight) => flight.status === "Boarding");

  const metrics = [
    {
      label: "Passenger Queue",
      value: pendingCheckIn.toLocaleString(),
      helper: "not checked in across active flights",
      icon: <AssignmentTurnedInIcon fontSize="small" />,
      tone: pendingCheckIn > 0 ? "warning" as const : "success" as const,
    },
    {
      label: "Service Queue",
      value: serviceQueue.length.toLocaleString(),
      helper: "meals, ancillary, and shop requests",
      icon: <RestaurantIcon fontSize="small" />,
      tone: serviceQueue.length > 0 ? "secondary" as const : "success" as const,
    },
    {
      label: "Seat Exceptions",
      value: seatingExceptions.length.toLocaleString(),
      helper: "family, group, assistance, premium",
      icon: <EventSeatIcon fontSize="small" />,
      tone: seatingExceptions.length > 0 ? "error" as const : "success" as const,
    },
    {
      label: "Flight Board",
      value: activeFlights.length.toLocaleString(),
      helper: `${boardingFlights.length} boarding, ${delayedFlights.length} delayed`,
      icon: <ConnectingAirportsIcon fontSize="small" />,
      tone: delayedFlights.length > 0 ? "warning" as const : "info" as const,
    },
  ];

  const roleActions = (() => {
    if (role === UserRole.CABIN_CREW) {
      return [
        { label: "Open Service Queue", view: "inflight" as const, icon: <SupportAgentIcon fontSize="small" /> },
        { label: "Open Seat Ops", view: "seatMap" as const, icon: <EventSeatIcon fontSize="small" /> },
      ];
    }

    if (role === UserRole.OPERATIONS) {
      return [
        { label: "Open Flight Board", view: "status" as const, icon: <ConnectingAirportsIcon fontSize="small" /> },
        { label: "Open Check-In", view: "checkin" as const, icon: <AirlineSeatReclineExtraIcon fontSize="small" /> },
        { label: "Open Seat Ops", view: "seatMap" as const, icon: <EventSeatIcon fontSize="small" /> },
      ];
    }

    return [
      { label: "Open Check-In Queue", view: "checkin" as const, icon: <AirlineSeatReclineExtraIcon fontSize="small" /> },
      { label: "Open Seat Ops", view: "seatMap" as const, icon: <EventSeatIcon fontSize="small" /> },
    ];
  })();

  return (
    <Box sx={{ px: { xs: 1.5, sm: 2, md: 3 }, py: { xs: 2, sm: 3 }, minWidth: 0 }}>
      <PageHeader title="Operations Overview" isConnected={isConnected} selectedFlightNumber={primaryFlight?.flightNumber} />

      <Stack spacing={3}>
        <Paper elevation={1} sx={{ p: { xs: 2, sm: 2.5 }, border: "1px solid", borderColor: "divider" }}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, lg: 7 }}>
              <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", flexWrap: "wrap", rowGap: 1 }}>
                <DashboardIcon color="primary" />
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="h5" sx={{ fontWeight: 750 }}>
                    {roleLabels[role]}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Operational work queue, exceptions, and next actions for the current shift.
                  </Typography>
                </Box>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, lg: 5 }}>
              <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", justifyContent: { xs: "flex-start", lg: "flex-end" }, rowGap: 1 }}>
                {roleActions.map((action) => (
                  <Button key={action.label} variant="outlined" size="small" startIcon={action.icon} onClick={() => onOpenView(action.view)}>
                    {action.label}
                  </Button>
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Paper>

        <Grid container spacing={2}>
          {metrics.map((metric) => (
            <Grid key={metric.label} size={{ xs: 12, sm: 6, lg: 3 }}>
              <MetricCard {...metric} />
            </Grid>
          ))}
        </Grid>

        <Grid container spacing={2} sx={{ alignItems: "stretch" }}>
          <Grid size={{ xs: 12, lg: 7 }}>
            <Paper elevation={1} sx={{ p: 2, height: "100%", border: "1px solid", borderColor: "divider" }}>
              <Stack spacing={2}>
                <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
                  <Box>
                    <Typography variant="h6">Priority Flight</Typography>
                    <Typography variant="body2" color="text.secondary">
                      Boarding readiness for the next active flight.
                    </Typography>
                  </Box>
                  {primaryFlight && <StatusChip status={primaryFlight.status} />}
                </Box>

                {primaryFlight ? (
                  <Stack spacing={1.5}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1, flexWrap: "wrap" }}>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 750 }}>
                          {primaryFlight.flightNumber}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {primaryFlight.origin || primaryFlight.from} to {primaryFlight.destination || primaryFlight.to}
                        </Typography>
                      </Box>
                      <Box sx={{ textAlign: { xs: "left", sm: "right" } }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          Gate {primaryFlight.gate || "TBD"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {primaryFlight.time || primaryFlight.departureTime}
                        </Typography>
                      </Box>
                    </Box>
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.75 }}>
                        <Typography variant="body2" color="text.secondary">
                          Check-in completion
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>
                          {checkedInPassengers}/{primaryFlightPassengers.length} ({formatPercent(boardingRate)})
                        </Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={Math.min(boardingRate, 100)} sx={{ height: 8, borderRadius: 1 }} />
                    </Box>
                    <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
                      <Chip label={`${assistanceQueue.length} assistance`} size="small" color={assistanceQueue.length ? "warning" : "success"} variant="outlined" />
                      <Chip label={`${serviceQueue.length} service requests`} size="small" color={serviceQueue.length ? "secondary" : "success"} variant="outlined" />
                      <Chip label={`${seatingExceptions.length} seat exceptions`} size="small" color={seatingExceptions.length ? "error" : "success"} variant="outlined" />
                    </Stack>
                  </Stack>
                ) : (
                  <Alert severity="info">No active flights are available.</Alert>
                )}
              </Stack>
            </Paper>
          </Grid>

          <Grid size={{ xs: 12, lg: 5 }}>
            <Paper elevation={1} sx={{ p: 2, height: "100%", border: "1px solid", borderColor: "divider" }}>
              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="h6">Exception Feed</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Highest impact items to resolve before departure.
                  </Typography>
                </Box>
                {seatingExceptions.length === 0 && delayedFlights.length === 0 && serviceQueue.length === 0 ? (
                  <Alert severity="success" variant="outlined">
                    No current operational exceptions.
                  </Alert>
                ) : (
                  <List dense disablePadding>
                    {delayedFlights.slice(0, 2).map((flight, flightIndex) => (
                      <ListItem key={`delay-${flight.id}-${flightIndex}`} disableGutters>
                        <ListItemText
                          primary={`${flight.flightNumber} delayed`}
                          secondary={`${flight.origin || flight.from} to ${flight.destination || flight.to} · Gate ${flight.gate || "TBD"}`}
                        />
                      </ListItem>
                    ))}
                    {seatingExceptions.slice(0, 3).map((exception) => (
                      <ListItem key={exception.id} disableGutters>
                        <ListItemText primary={exception.title} secondary={`${exception.description} ${exception.suggestedSeats.length ? `Suggest ${exception.suggestedSeats.join(", ")}` : ""}`} />
                      </ListItem>
                    ))}
                    {serviceQueue.slice(0, 2).map((passenger) => (
                      <ListItem key={`service-${passenger.id}`} disableGutters>
                        <ListItemText primary={`${passenger.name} service follow-up`} secondary={`Seat ${passenger.seat} · ${passenger.specialMeal || "Regular meal"}`} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        <Paper elevation={1} sx={{ p: 2, border: "1px solid", borderColor: "divider" }}>
          <Stack spacing={1.5}>
            <Box>
              <Typography variant="h6">Flight Board Snapshot</Typography>
              <Typography variant="body2" color="text.secondary">
                Active flights grouped by operational urgency.
              </Typography>
            </Box>
            <Grid container spacing={1.5}>
              {activeFlights.slice(0, 6).map((flight, flightIndex) => {
                const flightPassengers = getFlightPassengers(flight, passengers);
                const flightCheckedIn = flightPassengers.filter((passenger) => passenger.checkedIn).length;
                const flightRate = flightPassengers.length > 0 ? (flightCheckedIn / flightPassengers.length) * 100 : 0;

                return (
                  <Grid key={`${flight.id}-${flightIndex}`} size={{ xs: 12, md: 6, xl: 4 }}>
                    <Paper variant="outlined" sx={{ p: 1.5, height: "100%" }}>
                      <Stack spacing={1}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="subtitle2" sx={{ fontWeight: 750 }}>
                              {flight.flightNumber}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" noWrap>
                              {flight.origin || flight.from} to {flight.destination || flight.to}
                            </Typography>
                          </Box>
                          <StatusChip status={flight.status} />
                        </Box>
                        <Box sx={{ display: "flex", justifyContent: "space-between", gap: 1 }}>
                          <Typography variant="caption" color="text.secondary">
                            Gate {flight.gate || "TBD"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {flightCheckedIn}/{flightPassengers.length} checked in
                          </Typography>
                        </Box>
                        <LinearProgress variant="determinate" value={Math.min(flightRate, 100)} sx={{ height: 6, borderRadius: 1 }} />
                      </Stack>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          </Stack>
        </Paper>
      </Stack>
    </Box>
  );
}
