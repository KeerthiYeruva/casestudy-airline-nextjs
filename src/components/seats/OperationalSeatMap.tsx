"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import AnalyticsIcon from "@mui/icons-material/Analytics";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import GroupIcon from "@mui/icons-material/Group";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import SettingsIcon from "@mui/icons-material/Settings";
import StarIcon from "@mui/icons-material/Star";
import useCheckInStore from "../../stores/useCheckInStore";
import useDataStore from "../../stores/useDataStore";
import useRealtimeUpdates from "../../hooks/useRealtimeUpdates";
import FlightSelectionPanel from "../checkin/FlightSelectionPanel";
import FlightInfoGrid from "../ui/FlightInfoGrid";
import PageHeader from "../ui/PageHeader";
import SeatMapVisual, { type SeatMapMode } from "./SeatMapVisual";
import type { Passenger } from "../../types/passenger";

type OperationalSeatMapMode = Extract<SeatMapMode, "checkin" | "cabin" | "operations" | "admin">;

interface OperationalSeatMapProps {
  mode: OperationalSeatMapMode;
  onOpenCheckIn?: () => void;
  onOpenSeatManagement?: () => void;
}

const modeCopy: Record<OperationalSeatMapMode, { title: string; subtitle: string }> = {
  checkin: {
    title: "Seat Map",
    subtitle: "Assign seats, find passengers, and continue check-in from the shared cabin view.",
  },
  cabin: {
    title: "Seat Map",
    subtitle: "Read-only cabin view for passengers, meals, services, families, and groups.",
  },
  operations: {
    title: "Seat Map",
    subtitle: "Monitor occupancy, boarding progress, and family or group distribution.",
  },
  admin: {
    title: "Seat Map",
    subtitle: "Manage premium seating, seat rules, blocked-seat planning, and analytics.",
  },
};

const OperationalSeatMap: React.FC<OperationalSeatMapProps> = ({
  mode,
  onOpenCheckIn,
  onOpenSeatManagement,
}) => {
  const { flights, passengers, fetchFlights, fetchPassengers } = useDataStore();
  const { selectedFlight, selectFlight } = useCheckInStore();
  const { isConnected } = useRealtimeUpdates();
  const hasFetchedRef = useRef(false);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);

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
  }, [flights.length, passengers.length, fetchFlights, fetchPassengers]);

  useEffect(() => {
    if (selectedFlight || flights.length === 0) {
      return;
    }

    const defaultFlight =
      flights.find((flight) => flight.status === "Boarding") ??
      flights.find((flight) => flight.status === "On Time") ??
      flights[0];

    selectFlight(defaultFlight);
  }, [flights, selectFlight, selectedFlight]);

  const flightPassengers = selectedFlight
    ? passengers.filter((passenger) => passenger.flightId === selectedFlight.id)
    : [];
  const selectedPassengerOnFlight = selectedPassenger
    ? flightPassengers.find((passenger) => passenger.id === selectedPassenger.id) ?? null
    : null;
  const totalSeats = 60;
  const occupiedSeats = flightPassengers.filter((passenger) => passenger.seat).length;
  const checkedInPassengers = flightPassengers.filter((passenger) => passenger.checkedIn).length;
  const premiumPassengers = flightPassengers.filter((passenger) => passenger.premiumUpgrade).length;
  const specialMealPassengers = flightPassengers.filter(
    (passenger) => passenger.specialMeal && passenger.specialMeal !== "Regular"
  ).length;
  const serviceRequestPassengers = flightPassengers.filter(
    (passenger) => passenger.ancillaryServices.length > 0 || (passenger.shopRequests?.length ?? 0) > 0
  ).length;
  const familyPassengers = flightPassengers.filter((passenger) => passenger.familySeating).length;
  const groupPassengers = flightPassengers.filter((passenger) => passenger.groupSeating).length;
  const occupancyRate = Math.round((occupiedSeats / totalSeats) * 100);
  const boardingRate = flightPassengers.length > 0
    ? Math.round((checkedInPassengers / flightPassengers.length) * 100)
    : 0;
  const copy = modeCopy[mode];

  const handleFlightSelect = (flight: typeof flights[0]) => {
    selectFlight(flight);
    setSelectedPassenger(null);
  };

  const handleSeatClick = (seat: string) => {
    const passenger = flightPassengers.find((item) => item.seat === seat) ?? null;
    setSelectedPassenger(passenger);
  };

  const renderModeActions = () => {
    if (mode === "checkin") {
      return (
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
          <Button variant="contained" size="small" startIcon={<CheckCircleIcon />} onClick={onOpenCheckIn}>
            Continue Check-In
          </Button>
          <Chip icon={<FamilyRestroomIcon />} label="Auto Allocate Family" color="secondary" variant="outlined" />
          <Chip icon={<GroupIcon />} label="Auto Allocate Group" color="primary" variant="outlined" />
          <Chip icon={<StarIcon />} label="Premium Upgrade" color="warning" />
        </Stack>
      );
    }

    if (mode === "cabin") {
      return (
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
          <Chip icon={<RestaurantIcon />} label={`${specialMealPassengers} special meals`} color="secondary" variant="outlined" />
          <Chip label={`${serviceRequestPassengers} service requests`} color="primary" variant="outlined" />
          <Chip icon={<FamilyRestroomIcon />} label={`${familyPassengers} family seats`} variant="outlined" />
          <Chip icon={<GroupIcon />} label={`${groupPassengers} group seats`} variant="outlined" />
        </Stack>
      );
    }

    if (mode === "operations") {
      return (
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
          <Chip icon={<AnalyticsIcon />} label={`${occupancyRate}% occupancy`} color="primary" />
          <Chip icon={<CheckCircleIcon />} label={`${boardingRate}% boarded`} color="success" />
          <Chip icon={<FamilyRestroomIcon />} label={`${familyPassengers} family distribution`} variant="outlined" />
          <Chip icon={<GroupIcon />} label={`${groupPassengers} group distribution`} variant="outlined" />
        </Stack>
      );
    }

    return (
      <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
        <Button variant="contained" size="small" startIcon={<SettingsIcon />} onClick={onOpenSeatManagement}>
          Seat Management
        </Button>
        <Chip icon={<StarIcon />} label={`${premiumPassengers} premium seats`} color="warning" />
        <Chip icon={<BlockIcon />} label="Block seats" color="error" variant="outlined" />
        <Chip icon={<AnalyticsIcon />} label="Seat analytics" color="primary" variant="outlined" />
      </Stack>
    );
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, minWidth: 0 }}>
      <PageHeader
        title={copy.title}
        isConnected={isConnected}
        selectedFlightNumber={selectedFlight?.flightNumber}
      />

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 0 }}>
        <Grid size={{ xs: 12, md: 3 }} sx={{ minWidth: 0 }}>
          <FlightSelectionPanel
            flights={flights}
            selectedFlightId={selectedFlight?.id}
            onFlightSelect={handleFlightSelect}
            passengers={passengers}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 9 }} sx={{ minWidth: 0 }}>
          {selectedFlight ? (
            <>
              <FlightInfoGrid flight={selectedFlight} />
              <Paper elevation={1} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2, flexWrap: "wrap" }}>
                  <Box>
                    <Typography variant="h6" sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <AirlineSeatReclineExtraIcon color="primary" />
                      {copy.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {copy.subtitle}
                    </Typography>
                  </Box>
                  {renderModeActions()}
                </Box>
              </Paper>

              <Grid container spacing={2} sx={{ minWidth: 0 }}>
                <Grid size={{ xs: 12, lg: 8 }} sx={{ minWidth: 0 }}>
                  <SeatMapVisual passengers={flightPassengers} onSeatClick={handleSeatClick} mode={mode} />
                </Grid>
                <Grid size={{ xs: 12, lg: 4 }} sx={{ minWidth: 0 }}>
                  <Paper elevation={1} sx={{ p: 2 }}>
                    <Typography variant="subtitle1" gutterBottom>
                      Seat Context
                    </Typography>
                    <Stack spacing={1.25}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Capacity
                        </Typography>
                        <Typography variant="body2">
                          {occupiedSeats}/{totalSeats} occupied ({occupancyRate}%)
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Boarding
                        </Typography>
                        <Typography variant="body2">
                          {checkedInPassengers}/{flightPassengers.length} checked in ({boardingRate}%)
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">
                          Passenger Groups
                        </Typography>
                        <Typography variant="body2">
                          {familyPassengers} family, {groupPassengers} group
                        </Typography>
                      </Box>
                      {selectedPassengerOnFlight ? (
                        <Box sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
                          <Typography variant="subtitle2">{selectedPassengerOnFlight.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Seat {selectedPassengerOnFlight.seat} · {selectedPassengerOnFlight.checkedIn ? "Checked in" : "Not checked in"}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Meal: {selectedPassengerOnFlight.specialMeal || "Regular"}
                          </Typography>
                          {selectedPassengerOnFlight.ancillaryServices.length > 0 && (
                            <Typography variant="body2" color="text.secondary">
                              Services: {selectedPassengerOnFlight.ancillaryServices.join(", ")}
                            </Typography>
                          )}
                        </Box>
                      ) : (
                        <Alert severity="info">Select an occupied seat to inspect passenger context.</Alert>
                      )}
                    </Stack>
                  </Paper>
                </Grid>
              </Grid>
            </>
          ) : (
            <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
              <Typography variant="h6" color="text.secondary">
                Please select a flight to view the seat map
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Container>
  );
};

export default OperationalSeatMap;