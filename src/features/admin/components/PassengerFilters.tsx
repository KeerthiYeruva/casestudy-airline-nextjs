"use client";

import React, { useState } from "react";
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
  Chip,
  Collapse,
  SelectChangeEvent,
} from "@mui/material";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { Flight } from "../../../domain/flights/types";

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
  const [showResponsiveFilters, setShowResponsiveFilters] = useState(false);
  const selectedFlight = flights.find((flight) => flight.id === selectedFlightId);
  const missingFilterCount = [filterOptions.missingPassport, filterOptions.missingAddress, filterOptions.missingDOB].filter(Boolean).length;
  const hasActiveFilterSummary = Boolean(selectedFlight || searchQuery || missingFilterCount > 0);

  const handleFlightSelect = (flightId: string) => {
    onFlightSelect(flightId);
    if (flightId) {
      setShowResponsiveFilters(false);
    }
  };

  const handleClearAllFilters = () => {
    onClearFilters();
    onSearchChange("");
    onFlightSelect("");
    setShowResponsiveFilters(true);
  };

  const filterControls = (
    <>
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
              onChange={(e: SelectChangeEvent) => handleFlightSelect(e.target.value)}
            >
              <MenuItem value="">All Flights</MenuItem>
              {flights.map((flight, flightIndex) => (
                <MenuItem key={`${flight.id}-${flightIndex}`} value={flight.id}>
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
        <Button size="small" onClick={handleClearAllFilters}>
          Clear
        </Button>
        <Button size="small" color="warning" onClick={onResetData}>
          Reset Data
        </Button>
      </Box>
    </>
  );

  return (
    <Box sx={{ mb: 3 }}>
      {hasActiveFilterSummary && (
        <Box
          sx={{
            display: { xs: "block", md: "none" },
            p: 1.25,
            mb: showResponsiveFilters ? 1.5 : 0,
            borderRadius: 1,
            border: "1px solid",
            borderColor: "primary.light",
            bgcolor: "primary.50",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
            <Box sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 800 }}>
                {selectedFlight ? selectedFlight.flightNumber : "Passenger filters"}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                {selectedFlight
                  ? `${selectedFlight.origin || selectedFlight.from} → ${selectedFlight.destination || selectedFlight.to}`
                  : "All flights"}
              </Typography>
            </Box>
            <Button
              size="small"
              endIcon={showResponsiveFilters ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              onClick={() => setShowResponsiveFilters((open) => !open)}
              sx={{ whiteSpace: "nowrap" }}
            >
              {showResponsiveFilters ? "Hide" : "Change"}
            </Button>
          </Box>
          <Box sx={{ display: "flex", gap: 0.75, flexWrap: "wrap", mt: 1 }}>
            {searchQuery && <Chip label={`Search: ${searchQuery}`} size="small" />}
            {missingFilterCount > 0 && <Chip label={`${missingFilterCount} missing filter${missingFilterCount > 1 ? "s" : ""}`} size="small" color="warning" />}
          </Box>
        </Box>
      )}

      <Box sx={{ display: { xs: "block", md: "none" } }}>
        <Collapse in={!hasActiveFilterSummary || showResponsiveFilters}>
          {filterControls}
        </Collapse>
      </Box>

      <Box sx={{ display: { xs: "none", md: "block" } }}>
        {filterControls}
      </Box>
    </Box>
  );
};

export default PassengerFilters;
