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
import SearchIcon from "@mui/icons-material/Search";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import useDataStore from "../../stores/useDataStore";
import BookingDialog from "./BookingDialog";
import StatusChip from "../ui/StatusChip";
import type { Flight } from "../../types/flight";

type CabinClass = "Economy" | "Premium Economy" | "Business" | "First";

interface FlightSearchFilters {
  from: string;
  to: string;
  departureDate: string;
  returnDate: string;
  passengers: number;
  cabinClass: CabinClass;
}

const defaultFilters: FlightSearchFilters = {
  from: "",
  to: "",
  departureDate: "",
  returnDate: "",
  passengers: 1,
  cabinClass: "Economy",
};

const cabinClasses: CabinClass[] = ["Economy", "Premium Economy", "Business", "First"];

const normalizeLocation = (value: string) => value.toLowerCase().trim();

const matchesLocation = (flightValue: string, searchValue: string) => {
  if (!searchValue.trim()) return true;
  return normalizeLocation(flightValue).includes(normalizeLocation(searchValue));
};

const getRoute = (flight: Flight) => ({
  origin: flight.origin || flight.from || "",
  destination: flight.destination || flight.to || "",
});

export default function FlightSearch() {
  const { flights, passengers, fetchFlights, fetchPassengers, addPassenger } = useDataStore();
  const [filters, setFilters] = useState<FlightSearchFilters>(defaultFilters);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null);
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!hasFetchedRef.current && flights.length === 0) {
      fetchFlights();
      fetchPassengers();
      hasFetchedRef.current = true;
    }
  }, [fetchFlights, fetchPassengers, flights.length]);

  const availableOrigins = useMemo(
    () => Array.from(new Set(flights.map((flight) => getRoute(flight).origin))).sort(),
    [flights]
  );

  const availableDestinations = useMemo(
    () => Array.from(new Set(flights.map((flight) => getRoute(flight).destination))).sort(),
    [flights]
  );

  const searchResults = useMemo(() => {
    return flights.filter((flight) => {
      const { origin, destination } = getRoute(flight);
      const hasEnoughSeats = flight.availableSeats >= filters.passengers;
      const isBookable = flight.status !== "Cancelled" && flight.status !== "Departed" && flight.status !== "Arrived";

      return (
        matchesLocation(origin, filters.from) &&
        matchesLocation(destination, filters.to) &&
        (!filters.departureDate || flight.date === filters.departureDate) &&
        hasEnoughSeats &&
        isBookable
      );
    });
  }, [filters, flights]);

  const visibleFlights = hasSearched ? searchResults : flights.filter((flight) => flight.status !== "Cancelled").slice(0, 4);

  const updateFilter = <Key extends keyof FlightSearchFilters>(key: Key, value: FlightSearchFilters[Key]) => {
    setFilters((currentFilters) => ({ ...currentFilters, [key]: value }));
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
      <Stack spacing={3}>
        <Box>
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center", mb: 0.5 }}>
            <FlightTakeoffIcon color="primary" />
            <Typography variant="h4" component="h2" sx={{ fontWeight: 800, fontSize: { xs: "1.75rem", sm: "2.25rem" } }}>
              Flight Search
            </Typography>
          </Stack>
          <Typography variant="body1" color="text.secondary">
            Search available routes by city, travel date, passenger count, and cabin class.
          </Typography>
        </Box>

        <Paper elevation={3} sx={{ p: { xs: 2, md: 3 } }}>
          <Grid container spacing={2}>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="From"
                value={filters.from}
                onChange={(event) => updateFilter("from", event.target.value)}
                fullWidth
                placeholder="New York"
                slotProps={{ htmlInput: { list: "flight-search-origins" } }}
              />
              <datalist id="flight-search-origins">
                {availableOrigins.map((origin) => (
                  <option key={origin} value={origin} />
                ))}
              </datalist>
            </Grid>
            <Grid size={{ xs: 12, md: 3 }}>
              <TextField
                label="To"
                value={filters.to}
                onChange={(event) => updateFilter("to", event.target.value)}
                fullWidth
                placeholder="Los Angeles"
                slotProps={{ htmlInput: { list: "flight-search-destinations" } }}
              />
              <datalist id="flight-search-destinations">
                {availableDestinations.map((destination) => (
                  <option key={destination} value={destination} />
                ))}
              </datalist>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField
                label="Departure Date"
                type="date"
                value={filters.departureDate}
                onChange={(event) => updateFilter("departureDate", event.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField
                label="Return Date"
                type="date"
                value={filters.returnDate}
                onChange={(event) => updateFilter("returnDate", event.target.value)}
                fullWidth
                slotProps={{ inputLabel: { shrink: true } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 1 }}>
              <TextField
                label="Passengers"
                type="number"
                value={filters.passengers}
                onChange={(event) => updateFilter("passengers", Math.max(1, Number(event.target.value)))}
                fullWidth
                slotProps={{ htmlInput: { min: 1, max: 9 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 1 }}>
              <FormControl fullWidth>
                <InputLabel>Cabin</InputLabel>
                <Select
                  label="Cabin"
                  value={filters.cabinClass}
                  onChange={(event) => updateFilter("cabinClass", event.target.value as CabinClass)}
                >
                  {cabinClasses.map((cabinClass) => (
                    <MenuItem key={cabinClass} value={cabinClass}>
                      {cabinClass}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2, justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              Cabin class is captured for the booking flow coming next.
            </Typography>
            <Button variant="contained" startIcon={<SearchIcon />} onClick={() => setHasSearched(true)}>
              Search Flights
            </Button>
          </Stack>
        </Paper>

        <Stack spacing={2}>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {hasSearched ? `${searchResults.length} matching flights` : "Featured available flights"}
          </Typography>

          {visibleFlights.length === 0 ? (
            <Alert severity="info">No flights match your search. Try a different route or date.</Alert>
          ) : (
            <Grid container spacing={2}>
              {visibleFlights.map((flight) => {
                const { origin, destination } = getRoute(flight);

                return (
                  <Grid key={flight.id} size={{ xs: 12, md: 6 }}>
                    <Card variant="outlined" sx={{ height: "100%" }}>
                      <CardContent>
                        <Stack spacing={2}>
                          <Stack direction="row" spacing={1} sx={{ justifyContent: "space-between", alignItems: "flex-start" }}>
                            <Box>
                              <Typography variant="h6" sx={{ fontWeight: 800 }}>
                                {flight.flightNumber}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {flight.aircraft}
                              </Typography>
                            </Box>
                            <StatusChip status={flight.status} />
                          </Stack>

                          <Box>
                            <Typography variant="body2" color="text.secondary">
                              Route
                            </Typography>
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {origin} to {destination}
                            </Typography>
                          </Box>

                          <Grid container spacing={1.5}>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Typography variant="caption" color="text.secondary">
                                Date
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {flight.date}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Typography variant="caption" color="text.secondary">
                                Depart
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {flight.departureTime}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Typography variant="caption" color="text.secondary">
                                Arrive
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {flight.arrivalTime}
                              </Typography>
                            </Grid>
                            <Grid size={{ xs: 6, sm: 3 }}>
                              <Typography variant="caption" color="text.secondary">
                                Gate
                              </Typography>
                              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                {flight.gate || "TBD"}
                              </Typography>
                            </Grid>
                          </Grid>

                          <Stack direction="row" spacing={1} sx={{ flexWrap: "wrap", gap: 1 }}>
                            <Chip icon={<EventSeatIcon />} label={`${flight.availableSeats} seats available`} size="small" variant="outlined" />
                            <Chip label={filters.cabinClass} size="small" variant="outlined" />
                          </Stack>
                        </Stack>
                      </CardContent>
                      <CardActions sx={{ px: 2, pb: 2 }}>
                        <Button variant="outlined" fullWidth onClick={() => setSelectedFlight(flight)}>
                          Select Flight
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Stack>
      </Stack>
      <BookingDialog
        open={!!selectedFlight}
        flight={selectedFlight}
        cabinClass={filters.cabinClass}
        passengerCount={filters.passengers}
        passengers={passengers}
        onClose={() => setSelectedFlight(null)}
        onCreateBooking={async (passenger) => {
          const createdPassenger = await addPassenger(passenger);
          if (createdPassenger) {
            await fetchPassengers();
          }
          return createdPassenger;
        }}
      />
    </Container>
  );
}