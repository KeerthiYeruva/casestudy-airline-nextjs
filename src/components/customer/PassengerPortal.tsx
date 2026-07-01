"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import { useRealtimeUpdates } from "@/hooks/useRealtimeUpdates";
import useDataStore from "@/stores/useDataStore";
import BoardingPassDialog from "../checkin/BoardingPassDialog";
import ChangeSeatDialog from "../checkin/ChangeSeatDialog";
import ConnectionStatusChip from "../ui/ConnectionStatusChip";
import StatusChip from "../ui/StatusChip";
import type { Flight } from "@/types/flight";
import type { Passenger } from "@/types/passenger";

interface PortalSearch {
  bookingReference: string;
  lastName: string;
}

interface PassengerTrip {
  passenger: Passenger;
  flight: Flight | null;
}

const defaultSearch: PortalSearch = {
  bookingReference: "",
  lastName: "",
};

const normalize = (value: string) => value.trim().toLowerCase();

const getLastName = (name: string) => {
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] || "";
};

const isUpcomingFlight = (flight: Flight | null) => {
  if (!flight) return true;
  const flightDate = new Date(`${flight.date}T00:00:00`);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Number.isNaN(flightDate.getTime()) || flightDate >= today;
};

const formatRoute = (flight: Flight | null) => {
  if (!flight) return "Flight details pending";
  return `${flight.origin || flight.from} to ${flight.destination || flight.to}`;
};

export default function PassengerPortal() {
  const { flights, passengers, fetchFlights, fetchPassengers, checkInPassenger, changeSeat } = useDataStore();
  const { isConnected } = useRealtimeUpdates();
  const [search, setSearch] = useState<PortalSearch>(defaultSearch);
  const [submittedSearch, setSubmittedSearch] = useState<PortalSearch | null>(null);
  const [boardingPassTrip, setBoardingPassTrip] = useState<PassengerTrip | null>(null);
  const [seatChangeTrip, setSeatChangeTrip] = useState<PassengerTrip | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current && (flights.length === 0 || passengers.length === 0)) {
      fetchFlights();
      fetchPassengers();
      hasFetchedRef.current = true;
    }
  }, [fetchFlights, fetchPassengers, flights.length, passengers.length]);

  const trips = useMemo<PassengerTrip[]>(() => {
    if (!submittedSearch) return [];

    const bookingReference = normalize(submittedSearch.bookingReference);
    const lastName = normalize(submittedSearch.lastName);

    return passengers
      .filter((passenger) => {
        return (
          normalize(passenger.bookingReference) === bookingReference &&
          normalize(getLastName(passenger.name)) === lastName
        );
      })
      .map((passenger) => ({
        passenger,
        flight: flights.find((flight) => flight.id === passenger.flightId) || null,
      }));
  }, [flights, passengers, submittedSearch]);

  const upcomingTrips = trips.filter((trip) => isUpcomingFlight(trip.flight));
  const pastTrips = trips.filter((trip) => !isUpcomingFlight(trip.flight));

  const updateSearch = <Key extends keyof PortalSearch>(key: Key, value: PortalSearch[Key]) => {
    setSearch((currentSearch) => ({ ...currentSearch, [key]: value }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setActionError(null);
    setSubmittedSearch({
      bookingReference: search.bookingReference.trim(),
      lastName: search.lastName.trim(),
    });
  };

  const handleCheckIn = async (trip: PassengerTrip) => {
    setActionError(null);
    const checkedInPassenger = await checkInPassenger(trip.passenger.id);

    if (!checkedInPassenger) {
      setActionError("Online check-in could not be completed. Please try again or see an agent at the airport.");
      return;
    }

    await fetchPassengers();
    setBoardingPassTrip({ passenger: checkedInPassenger, flight: trip.flight });
  };

  const handleChangeSeat = async (newSeat: string) => {
    if (!seatChangeTrip) return;

    setActionError(null);
    const updatedPassenger = await changeSeat(seatChangeTrip.passenger.id, newSeat);

    if (!updatedPassenger) {
      setActionError("Seat could not be changed. Please choose another seat.");
      return;
    }

    await fetchPassengers();
    setSeatChangeTrip(null);
  };

  const renderTripCard = ({ passenger, flight }: PassengerTrip) => (
    <Card key={passenger.id} variant="outlined">
      <CardContent>
        <Stack spacing={2}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ justifyContent: "space-between" }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                {flight?.flightNumber || passenger.flightId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {formatRoute(flight)}
              </Typography>
            </Box>
            {flight && <StatusChip status={flight.status} />}
          </Stack>

          <Grid container spacing={1.5}>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" color="text.secondary">Passenger</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{passenger.name}</Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" color="text.secondary">Date</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{flight?.date || "TBD"}</Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" color="text.secondary">Seat</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{passenger.seat || "TBD"}</Typography>
            </Grid>
            <Grid size={{ xs: 6, sm: 3 }}>
              <Typography variant="caption" color="text.secondary">Gate</Typography>
              <Typography variant="body2" sx={{ fontWeight: 700 }}>{flight?.gate || "TBD"}</Typography>
            </Grid>
          </Grid>

          <Divider />

          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
            <Chip icon={<ConfirmationNumberIcon />} label={`PNR ${passenger.bookingReference}`} size="small" variant="outlined" />
            <Chip label={passenger.checkedIn ? "Checked in" : "Check-in pending"} size="small" color={passenger.checkedIn ? "success" : "default"} />
            {passenger.premiumUpgrade && <Chip label="Premium seat" size="small" color="primary" variant="outlined" />}
            {passenger.ancillaryServices.map((service) => (
              <Chip key={service} label={service} size="small" variant="outlined" />
            ))}
          </Stack>
        </Stack>
      </CardContent>
      <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: "flex-end", flexWrap: "wrap", gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<AirlineSeatReclineExtraIcon />}
          onClick={() => setSeatChangeTrip({ passenger, flight })}
          disabled={passenger.checkedIn}
        >
          Change Seat
        </Button>
        {passenger.checkedIn ? (
          <Button variant="contained" startIcon={<ConfirmationNumberIcon />} onClick={() => setBoardingPassTrip({ passenger, flight })}>
            Boarding Pass
          </Button>
        ) : (
          <Button variant="contained" startIcon={<FlightTakeoffIcon />} onClick={() => handleCheckIn({ passenger, flight })}>
            Check In Online
          </Button>
        )}
      </CardActions>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", justifyContent: "space-between", mb: 0.5, flexWrap: "wrap" }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <ManageSearchIcon color="primary" />
              <Typography variant="h4" component="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.75rem", sm: "2.25rem" } }}>
                My Trips
              </Typography>
            </Stack>
            <ConnectionStatusChip isConnected={isConnected} />
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Find a booking by PNR and last name to view upcoming flights, past trips, and booking details.
          </Typography>
        </Box>

        <Paper component="form" elevation={3} onSubmit={handleSubmit} sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                label="PNR"
                value={search.bookingReference}
                onChange={(event) => updateSearch("bookingReference", event.target.value.toUpperCase())}
                fullWidth
                required
                placeholder="ABC123"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 5 }}>
              <TextField
                label="Last Name"
                value={search.lastName}
                onChange={(event) => updateSearch("lastName", event.target.value)}
                fullWidth
                required
                placeholder="Patel"
              />
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button type="submit" variant="contained" startIcon={<FlightTakeoffIcon />} fullWidth>
                Find Trip
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {submittedSearch && trips.length === 0 && (
          <Alert severity="info">No booking matched that PNR and last name.</Alert>
        )}

        {actionError && <Alert severity="error">{actionError}</Alert>}

        {trips.length > 0 && (
          <Stack spacing={3}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                Upcoming Flights
              </Typography>
              {upcomingTrips.length > 0 ? (
                <Stack spacing={2}>{upcomingTrips.map(renderTripCard)}</Stack>
              ) : (
                <Alert severity="info">No upcoming flights for this booking.</Alert>
              )}
            </Box>

            <Box>
              <Typography variant="h6" sx={{ fontWeight: 800, mb: 1.5 }}>
                Past Flights
              </Typography>
              {pastTrips.length > 0 ? (
                <Stack spacing={2}>{pastTrips.map(renderTripCard)}</Stack>
              ) : (
                <Alert severity="info">No past flights for this booking.</Alert>
              )}
            </Box>
          </Stack>
        )}
      </Stack>

      {seatChangeTrip && (
        <ChangeSeatDialog
          open={!!seatChangeTrip}
          currentSeat={seatChangeTrip.passenger.seat}
          passengerName={seatChangeTrip.passenger.name}
          onClose={() => setSeatChangeTrip(null)}
          onConfirm={handleChangeSeat}
        />
      )}

      <BoardingPassDialog
        open={!!boardingPassTrip}
        passenger={boardingPassTrip?.passenger || null}
        flight={boardingPassTrip?.flight || null}
        onClose={() => setBoardingPassTrip(null)}
      />
    </Container>
  );
}