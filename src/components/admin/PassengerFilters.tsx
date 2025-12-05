"use client";

import React from "react";
import {
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Button,
  SelectChangeEvent,
} from "@mui/material";
import { Flight } from "@/types";

interface FilterOptions {
  missingPassport: boolean;
  missingAddress: boolean;
  missingDOB: boolean;
}

interface PassengerFiltersProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFlightId: string;
  onFlightSelect: (flightId: string) => void;
  flights: Flight[];
  filterOptions: FilterOptions;
  onFilterChange: (filter: Partial<FilterOptions>) => void;
  onClearFilters: () => void;
  onResetData: () => void;
}

const PassengerFilters: React.FC<PassengerFiltersProps> = ({
  searchQuery,
  onSearchChange,
  selectedFlightId,
  onFlightSelect,
  flights,
  filterOptions,
  onFilterChange,
  onClearFilters,
  onResetData,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            size="small"
            label="Search by Passenger Name"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Enter passenger name..."
          />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth size="small">
            <InputLabel>Filter by Flight</InputLabel>
            <Select
              value={selectedFlightId}
              label="Filter by Flight"
              onChange={(e: SelectChangeEvent) => onFlightSelect(e.target.value)}
            >
              <MenuItem value="">All Flights</MenuItem>
              {flights.map((flight) => (
                <MenuItem key={flight.id} value={flight.id}>
                  {flight.flightNumber} - {flight.origin || flight.from} → {flight.destination || flight.to} ({flight.time || flight.departureTime})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap" }}>
        <Typography variant="body2">Missing:</Typography>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={filterOptions.missingPassport}
                onChange={(e) =>
                  onFilterChange({ missingPassport: e.target.checked })
                }
              />
            }
            label="Passport"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterOptions.missingAddress}
                onChange={(e) =>
                  onFilterChange({ missingAddress: e.target.checked })
                }
              />
            }
            label="Address"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filterOptions.missingDOB}
                onChange={(e) =>
                  onFilterChange({ missingDOB: e.target.checked })
                }
              />
            }
            label="DOB"
          />
        </FormGroup>
        <Button size="small" onClick={onClearFilters}>
          Clear
        </Button>
        <Button size="small" color="warning" onClick={onResetData}>
          Reset Data
        </Button>
      </Box>
    </Box>
  );
};

export default PassengerFilters;
