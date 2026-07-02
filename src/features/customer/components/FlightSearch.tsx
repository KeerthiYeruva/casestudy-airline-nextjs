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
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import SwapHorizIcon from "@mui/icons-material/SwapHoriz";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import useDataStore from "../../../stores/useDataStore";
import BookingDialog from "./BookingDialog";
import StatusChip from "../../../shared/components/ui/StatusChip";
import type { Flight } from "../../../domain/flights/types";

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

const isBookableFlight = (flight: Flight) => flight.status !== "Cancelled" && flight.status !== "Departed" && flight.status !== "Arrived";
const isBeforeDate = (date: string, comparisonDate: string) => Boolean(date && comparisonDate && date < comparisonDate);

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
    () => Array.from(new Set(
      flights
        .filter((flight) => isBookableFlight(flight))
        .filter((flight) => !filters.to || getRoute(flight).destination === filters.to)
        .map((flight) => getRoute(flight).origin)
        .filter(Boolean)
    )).sort(),
    [filters.to, flights]
  );

  const availableDestinations = useMemo(
    () => Array.from(new Set(
      flights
        .filter((flight) => isBookableFlight(flight))
        .filter((flight) => !filters.from || getRoute(flight).origin === filters.from)
        .map((flight) => getRoute(flight).destination)
        .filter(Boolean)
    )).sort(),
    [filters.from, flights]
  );

  const effectiveFrom = availableOrigins.includes(filters.from) ? filters.from : "";
  const effectiveTo = availableDestinations.includes(filters.to) ? filters.to : "";

  const routeOptions = useMemo(
    () => Array.from(new Set(
      flights
        .filter((flight) => isBookableFlight(flight))
        .map((flight) => {
          const { origin, destination } = getRoute(flight);
          return origin && destination ? `${origin} -> ${destination}` : "";
        })
        .filter(Boolean)
    )).sort(),
    [flights]
  );

  const searchResults = useMemo(() => {
    return flights.filter((flight) => {
      const { origin, destination } = getRoute(flight);
      const hasEnoughSeats = flight.availableSeats >= filters.passengers;

      return (
        matchesLocation(origin, effectiveFrom) &&
        matchesLocation(destination, effectiveTo) &&
        (!filters.departureDate || flight.date === filters.departureDate) &&
        hasEnoughSeats &&
        isBookableFlight(flight)
      );
    });
  }, [effectiveFrom, effectiveTo, filters.departureDate, filters.passengers, flights]);

  const visibleFlights = hasSearched ? searchResults : flights.filter((flight) => isBookableFlight(flight)).slice(0, 4);
  const hasActiveFilters = Boolean(
    hasSearched ||
    filters.from ||
    filters.to ||
    filters.departureDate ||
    filters.returnDate ||
    filters.passengers !== defaultFilters.passengers ||
    filters.cabinClass !== defaultFilters.cabinClass
  );

  const updateFilter = <Key extends keyof FlightSearchFilters>(key: Key, value: FlightSearchFilters[Key]) => {
    setFilters((currentFilters) => {
      if (key === "from") {
        const nextFrom = value as string;
        const routeStillExists = flights.some((flight) => {
          const { origin, destination } = getRoute(flight);
          return isBookableFlight(flight) && origin === nextFrom && destination === currentFilters.to;
        });

        return {
          ...currentFilters,
          from: nextFrom,
          to: !nextFrom || !currentFilters.to || routeStillExists ? currentFilters.to : "",
        };
      }

      if (key === "to") {
        const nextTo = value as string;
        const routeStillExists = flights.some((flight) => {
          const { origin, destination } = getRoute(flight);
          return isBookableFlight(flight) && origin === currentFilters.from && destination === nextTo;
        });

        return {
          ...currentFilters,
          from: !nextTo || !currentFilters.from || routeStillExists ? currentFilters.from : "",
          to: nextTo,
        };
      }

      if (key === "departureDate") {
        const nextDepartureDate = value as string;

        return {
          ...currentFilters,
          departureDate: nextDepartureDate,
          returnDate: isBeforeDate(currentFilters.returnDate, nextDepartureDate) ? "" : currentFilters.returnDate,
        };
      }

      if (key === "returnDate") {
        const nextReturnDate = value as string;

        return {
          ...currentFilters,
          returnDate: isBeforeDate(nextReturnDate, currentFilters.departureDate) ? currentFilters.departureDate : nextReturnDate,
        };
      }

      return { ...currentFilters, [key]: value };
    });
  };

  const swapRoute = () => {
    setFilters((currentFilters) => ({
      ...currentFilters,
      from: currentFilters.to,
      to: currentFilters.from,
    }));
  };

  const clearSearch = () => {
    setFilters(defaultFilters);
    setHasSearched(false);
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

        <Paper
          variant="outlined"
          sx={{
            p: { xs: 2, md: 3 },
            borderRadius: 2,
            bgcolor: "background.paper",
          }}
        >
          <Stack spacing={2.25}>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) auto minmax(0, 1fr)" },
                gap: { xs: 1.5, md: 2 },
                alignItems: "center",
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="flight-search-origin-label" shrink>From</InputLabel>
                <Select
                  labelId="flight-search-origin-label"
                  label="From"
                  value={effectiveFrom}
                  onChange={(event) => updateFilter("from", event.target.value)}
                  displayEmpty
                  renderValue={(value) => value || <Typography component="span" color="text.secondary">Any origin</Typography>}
                >
                  <MenuItem value="">Any origin</MenuItem>
                  {availableOrigins.map((origin) => (
                    <MenuItem key={origin} value={origin}>{origin}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Tooltip title="Swap route">
                <span>
                  <IconButton
                    aria-label="Swap origin and destination"
                    onClick={swapRoute}
                    disabled={!filters.from && !filters.to}
                    sx={{
                      width: 44,
                      height: 44,
                      minHeight: 0,
                      border: 1,
                      borderColor: "divider",
                      borderRadius: 1.5,
                      bgcolor: "background.default",
                      display: "flex",
                      mx: "auto",
                    }}
                  >
                    <SwapHorizIcon />
                  </IconButton>
                </span>
              </Tooltip>

              <FormControl fullWidth>
                <InputLabel id="flight-search-destination-label" shrink>To</InputLabel>
                <Select
                  labelId="flight-search-destination-label"
                  label="To"
                  value={effectiveTo}
                  onChange={(event) => updateFilter("to", event.target.value)}
                  displayEmpty
                  renderValue={(value) => value || <Typography component="span" color="text.secondary">Any destination</Typography>}
                >
                  <MenuItem value="">Any destination</MenuItem>
                  {availableDestinations.map((destination) => (
                    <MenuItem key={destination} value={destination}>{destination}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Departure Date"
                type="date"
                value={filters.departureDate}
                onChange={(event) => updateFilter("departureDate", event.target.value)}
                fullWidth
                autoComplete="off"
                slotProps={{
                  htmlInput: { max: filters.returnDate || undefined },
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <TextField
                label="Return Date"
                type="date"
                value={filters.returnDate}
                onChange={(event) => updateFilter("returnDate", event.target.value)}
                fullWidth
                autoComplete="off"
                slotProps={{
                  htmlInput: { min: filters.departureDate || undefined },
                  inputLabel: { shrink: true },
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 2 }}>
              <TextField
                label="Passengers"
                type="number"
                value={filters.passengers}
                onChange={(event) => updateFilter("passengers", Math.max(1, Number(event.target.value)))}
                fullWidth
                slotProps={{ htmlInput: { min: 1, max: 9 } }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
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
          </Stack>

          <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mt: 2, justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              {routeOptions.length} available routes loaded.
            </Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
              <Button variant="text" onClick={clearSearch} disabled={!hasActiveFilters}>
                Show all flights
              </Button>
              <Button variant="contained" startIcon={<SearchIcon />} onClick={() => setHasSearched(true)}>
                Search Flights
              </Button>
            </Stack>
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