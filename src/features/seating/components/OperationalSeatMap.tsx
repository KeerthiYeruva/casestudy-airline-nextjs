"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
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
import useCheckInStore from "../../../stores/useCheckInStore";
import useDataStore from "../../../stores/useDataStore";
import useToastStore from "../../../stores/useToastStore";
import useRealtimeUpdates from "../../../hooks/useRealtimeUpdates";
import FlightSelectionPanel from "../../check-in/components/FlightSelectionPanel";
import OperationalWorkspace from "../../../shared/components/layout/OperationalWorkspace";
import SeatMapVisual, { type SeatMapMode } from "./SeatMapVisual";
import SeatingRecommendationsPanel from "./SeatingRecommendationsPanel";
import type { Passenger } from "../../../domain/passengers/types";
import type { SeatRecommendation } from "../utils/seatRecommendations";

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


const layoutByMode: Record<OperationalSeatMapMode, { rightRailWidth: { lg: number; xl: number }; seatMapAlign: "left" | "center" | "right" }> = {
  checkin: { rightRailWidth: { lg: 4.8, xl: 4.8 }, seatMapAlign: "left" },
  cabin: { rightRailWidth: { lg: 6.2, xl: 5.8 }, seatMapAlign: "left" },
  operations: { rightRailWidth: { lg: 5.6, xl: 5.4 }, seatMapAlign: "left" },
  admin: { rightRailWidth: { lg: 6, xl: 5.6 }, seatMapAlign: "left" },
};
const accessibleSeats = new Set(["1C", "1D", "2C", "2D"]);
const aisleSeats = new Set(["C", "D"]);
const getSeatRow = (seat: string) => Number.parseInt(seat.match(/^\d+/)?.[0] ?? "0", 10);
const getSeatLetter = (seat: string) => seat.match(/[A-Z]$/)?.[0] ?? "";

const OperationalSeatMap: React.FC<OperationalSeatMapProps> = ({
  mode,
  onOpenCheckIn,
  onOpenSeatManagement,
}) => {
  const { flights, passengers, fetchFlights, fetchPassengers, updatePassenger } = useDataStore();
  const { selectedFlight, selectFlight } = useCheckInStore();
  const { showToast } = useToastStore();
  const { isConnected } = useRealtimeUpdates();
  const hasFetchedRef = useRef(false);
  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);

  useEffect(() => {
    if (!hasFetchedRef.current) {
      if (flights.length === 0) {
        fetchFlights();
      }
      fetchPassengers();
      hasFetchedRef.current = true;
    }
  }, [flights.length, fetchFlights, fetchPassengers]);

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
    (passenger) => (passenger.ancillaryServices?.length ?? 0) > 0 || (passenger.shopRequests?.length ?? 0) > 0
  ).length;
  const familyPassengers = flightPassengers.filter((passenger) => passenger.familySeating).length;
  const groupPassengers = flightPassengers.filter((passenger) => passenger.groupSeating).length;
  const wheelchairPassengers = flightPassengers.filter((passenger) => passenger.wheelchair);
  const occupiedAccessibleSeats = flightPassengers.filter((passenger) => accessibleSeats.has(passenger.seat)).length;
  const unassignedAccessiblePassengers = wheelchairPassengers.filter((passenger) => !passenger.seat).length;
  const nonOptimalAccessiblePassengers = wheelchairPassengers.filter((passenger) => {
    if (!passenger.seat) return false;
    return !aisleSeats.has(getSeatLetter(passenger.seat)) || getSeatRow(passenger.seat) > 5;
  }).length;
  const occupancyRate = Math.round((occupiedSeats / totalSeats) * 100);
  const boardingRate = flightPassengers.length > 0
    ? Math.round((checkedInPassengers / flightPassengers.length) * 100)
    : 0;
  const copy = modeCopy[mode];
  const canApplySeatRecommendations = mode === "checkin" || mode === "admin";
  const layout = layoutByMode[mode];

  const handleFlightSelect = (flight: typeof flights[0]) => {
    selectFlight(flight);
    setSelectedPassenger(null);
  };

  const handleSeatClick = (seat: string) => {
    const passenger = flightPassengers.find((item) => item.seat === seat) ?? null;
    setSelectedPassenger(passenger);
  };

  const handleRecommendationAction = async (recommendation: SeatRecommendation) => {
    const passenger = flightPassengers.find((item) => item.id === recommendation.passengerIds[0]);
    const suggestedSeat = recommendation.suggestedSeats[0];

    if (!passenger) {
      showToast("Passenger not found for seating recommendation", "error");
      return;
    }

    if (!suggestedSeat) {
      setSelectedPassenger(passenger);
      showToast("No available suggested seat for this recommendation", "info");
      return;
    }

    const result = await updatePassenger(passenger.id, { seat: suggestedSeat });
    if (result) {
      showToast(`Moved ${passenger.name} to ${suggestedSeat}`, "success");
      setSelectedPassenger(null);
      await fetchPassengers();
    } else {
      showToast(`Failed to move ${passenger.name} to ${suggestedSeat}`, "error");
    }
  };

  const renderModeActions = () => {
    if (mode === "checkin") {
      return (
        <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", rowGap: 1 }}>
          <Button variant="contained" size="small" startIcon={<CheckCircleIcon />} onClick={onOpenCheckIn}>
            Continue Check-In
          </Button>
          <Button variant="outlined" size="small" color="secondary" startIcon={<FamilyRestroomIcon />} onClick={onOpenCheckIn}>
            Open Family Seating
          </Button>
          <Button variant="outlined" size="small" startIcon={<GroupIcon />} onClick={onOpenCheckIn}>
            Open Group Seating
          </Button>
          <Button variant="outlined" size="small" color="warning" startIcon={<StarIcon />} onClick={onOpenCheckIn}>
            Open Premium Upgrades
          </Button>
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
        <Button variant="outlined" size="small" color="error" startIcon={<BlockIcon />} onClick={onOpenSeatManagement}>
          Manage Blocked Seats
        </Button>
        <Button variant="outlined" size="small" startIcon={<AnalyticsIcon />} onClick={onOpenSeatManagement}>
          View Seat Analytics
        </Button>
      </Stack>
    );
  };

  return (
    <OperationalWorkspace
      title={copy.title}
      isConnected={isConnected}
      selectedFlight={selectedFlight}
      operationalPassengers={flightPassengers}
      leftRail={(
        <FlightSelectionPanel
          flights={flights}
          selectedFlightId={selectedFlight?.id}
          onFlightSelect={handleFlightSelect}
          passengers={passengers}
        />
      )}
      rightRailWidth={layout.rightRailWidth}
      rightRail={selectedFlight && (
        <Stack spacing={2}>
          <Paper elevation={1} sx={{ p: 2 }}>
            <Stack spacing={1.5}>
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
            </Stack>
          </Paper>

          <SeatingRecommendationsPanel
            passengers={flightPassengers}
            onReviewFamily={onOpenCheckIn}
            onReviewGroup={onOpenCheckIn}
            onApplyRecommendation={canApplySeatRecommendations ? handleRecommendationAction : undefined}
            onSelectPassenger={setSelectedPassenger}
          />

          <Paper elevation={1} sx={{ p: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              Seat Context
            </Typography>
            <Stack spacing={1.25}>
              <Box>
                <Typography variant="caption" color="text.secondary">Capacity</Typography>
                <Typography variant="body2">{occupiedSeats}/{totalSeats} occupied ({occupancyRate}%)</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Boarding</Typography>
                <Typography variant="body2">{checkedInPassengers}/{flightPassengers.length} checked in ({boardingRate}%)</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Passenger Groups</Typography>
                <Typography variant="body2">{familyPassengers} family, {groupPassengers} group</Typography>
              </Box>
              {mode === "admin" && (
                <Box sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
                  <Typography variant="subtitle2" gutterBottom>Accessibility Seats</Typography>
                  <Stack spacing={0.75}>
                    <Typography variant="body2" color="text.secondary">
                      Reserved: {accessibleSeats.size} · Occupied: {occupiedAccessibleSeats}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Wheelchair requests: {wheelchairPassengers.length}
                    </Typography>
                    <Typography variant="body2" color={nonOptimalAccessiblePassengers > 0 ? "warning.main" : "text.secondary"}>
                      Needs better accessible seat: {nonOptimalAccessiblePassengers}
                    </Typography>
                    <Typography variant="body2" color={unassignedAccessiblePassengers > 0 ? "warning.main" : "text.secondary"}>
                      Unassigned accessible passengers: {unassignedAccessiblePassengers}
                    </Typography>
                  </Stack>
                </Box>
              )}
              {selectedPassengerOnFlight && (
                <Box sx={{ pt: 1, borderTop: "1px solid", borderColor: "divider" }}>
                  <Typography variant="subtitle2">{selectedPassengerOnFlight.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Seat {selectedPassengerOnFlight.seat} · {selectedPassengerOnFlight.checkedIn ? "Checked in" : "Not checked in"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Meal: {selectedPassengerOnFlight.specialMeal || "Regular"}
                  </Typography>
                  {(selectedPassengerOnFlight.ancillaryServices?.length ?? 0) > 0 && (
                    <Typography variant="body2" color="text.secondary">
                      Services: {selectedPassengerOnFlight.ancillaryServices?.join(", ")}
                    </Typography>
                  )}
                </Box>
              )}
            </Stack>
          </Paper>
        </Stack>
      )}
      emptyState={(
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">
            Please select a flight to view the seat map
          </Typography>
        </Paper>
      )}
    >
      <SeatMapVisual passengers={flightPassengers} onSeatClick={handleSeatClick} mode={mode} desktopAlign={layout.seatMapAlign} />

      <Dialog
        open={!!selectedPassengerOnFlight}
        onClose={() => setSelectedPassenger(null)}
        maxWidth="xs"
        fullWidth
        aria-labelledby="seat-passenger-dialog-title"
      >
        <DialogTitle id="seat-passenger-dialog-title">Passenger Details</DialogTitle>
        {selectedPassengerOnFlight && (
          <DialogContent dividers>
            <Stack spacing={2}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800 }}>
                  {selectedPassengerOnFlight.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Seat {selectedPassengerOnFlight.seat} · {selectedPassengerOnFlight.flightId}
                </Typography>
              </Box>

              <Divider />

              <Stack spacing={1}>
                <Typography variant="body2">
                  Booking: <strong>{selectedPassengerOnFlight.bookingReference || "Not assigned"}</strong>
                </Typography>
                <Typography variant="body2">
                  Status: <strong>{selectedPassengerOnFlight.checkedIn ? "Checked in" : "Not checked in"}</strong>
                </Typography>
                <Typography variant="body2">
                  Meal: <strong>{selectedPassengerOnFlight.specialMeal || "Regular"}</strong>
                </Typography>
                {selectedPassengerOnFlight.premiumUpgrade && <Chip label="Premium seat" color="warning" size="small" />}
              </Stack>

              {(selectedPassengerOnFlight.ancillaryServices?.length ?? 0) > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Services
                  </Typography>
                  <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                    {selectedPassengerOnFlight.ancillaryServices?.map((service) => (
                      <Chip key={service} label={service} size="small" variant="outlined" />
                    ))}
                  </Stack>
                </Box>
              )}

              {(selectedPassengerOnFlight.shopRequests?.length ?? 0) > 0 && (
                <Box>
                  <Typography variant="subtitle2" gutterBottom>
                    Shop Requests
                  </Typography>
                  <Stack spacing={0.75}>
                    {selectedPassengerOnFlight.shopRequests?.map((request) => (
                      <Typography key={request.itemName} variant="body2" color="text.secondary">
                        {request.itemName} x{request.quantity}
                      </Typography>
                    ))}
                  </Stack>
                </Box>
              )}
            </Stack>
          </DialogContent>
        )}
        <DialogActions>
          <Button onClick={() => setSelectedPassenger(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </OperationalWorkspace>
  );
};

export default OperationalSeatMap;