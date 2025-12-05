"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { Passenger, Flight } from "@/types";
import { SEAT_ROWS, SEAT_LETTERS } from "@/constants/appConstants";

interface SeatSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  onSelectSeat: (seat: string) => void;
  selectedSeat: string;
  flightId: string;
  flight: Flight | undefined;
  allPassengers: Passenger[];
  currentPassengerId: string;
}

const SeatSelectionDialog: React.FC<SeatSelectionDialogProps> = ({
  open,
  onClose,
  onSelectSeat,
  selectedSeat,
  flightId,
  flight,
  allPassengers,
  currentPassengerId,
}) => {
  // Get occupied seats for the selected flight
  const getOccupiedSeats = (): Set<string> => {
    if (!flightId) return new Set();

    return new Set(
      allPassengers
        .filter((p) => p.flightId === flightId && p.id !== currentPassengerId)
        .map((p) => p.seat)
        .filter(Boolean)
    );
  };

  // Generate all available seats
  const generateAvailableSeats = (): string[] => {
    const occupiedSeats = getOccupiedSeats();
    const allSeats: string[] = [];

    for (let row = 1; row <= SEAT_ROWS; row++) {
      for (const letter of SEAT_LETTERS) {
        const seat = `${row}${letter}`;
        if (!occupiedSeats.has(seat)) {
          allSeats.push(seat);
        }
      }
    }

    return allSeats;
  };

  const availableSeats = generateAvailableSeats();
  const occupiedSeats = getOccupiedSeats();

  const handleConfirm = () => {
    if (selectedSeat) {
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        Select Your Seat
        {flight && (
          <Typography variant="body2" color="text.secondary">
            Flight: {flight.name || flight.flightNumber} - {flight.origin} to{" "}
            {flight.destination}
          </Typography>
        )}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          {/* Flight Info */}
          <Box
            sx={{
              mb: 3,
              p: 2,
              backgroundColor: "#e3f2fd",
              borderRadius: 1,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Typography variant="body1" fontWeight="bold">
              Available Seats: {availableSeats.length} of {SEAT_ROWS * SEAT_LETTERS.length}
            </Typography>
            {selectedSeat && (
              <Typography variant="body1" color="primary" fontWeight="bold">
                Selected: {selectedSeat}
              </Typography>
            )}
          </Box>

          {/* Seat Map */}
          <Box
            sx={{
              p: 3,
              border: "2px solid #e0e0e0",
              borderRadius: 2,
              backgroundColor: "#fafafa",
            }}
          >
            {/* Aircraft Front Indicator */}
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <Typography
                variant="caption"
                sx={{
                  display: "inline-block",
                  px: 2,
                  py: 0.5,
                  backgroundColor: "#1976d2",
                  color: "white",
                  borderRadius: 1,
                }}
              >
                ✈ FRONT OF AIRCRAFT
              </Typography>
            </Box>

            {/* Column Headers */}
            <Box sx={{ display: "flex", gap: 0.5, mb: 1, alignItems: "center" }}>
              <Box sx={{ width: 30 }} />
              {SEAT_LETTERS.map((letter, index) => (
                <React.Fragment key={letter}>
                  <Box
                    sx={{
                      minWidth: 40,
                      width: 40,
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: "0.875rem",
                    }}
                  >
                    {letter}
                  </Box>
                  {index === 2 && <Box sx={{ width: 24 }} />}
                </React.Fragment>
              ))}
            </Box>

            {/* Seat Grid */}
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {Array.from({ length: SEAT_ROWS }, (_, rowIndex) => (
                <Box
                  key={rowIndex}
                  sx={{ display: "flex", gap: 0.5, alignItems: "center" }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      width: 30,
                      fontWeight: "bold",
                      textAlign: "center",
                      color: "#666",
                    }}
                  >
                    {rowIndex + 1}
                  </Typography>
                  {SEAT_LETTERS.map((letter, letterIndex) => {
                    const seat = `${rowIndex + 1}${letter}`;
                    const isOccupied = occupiedSeats.has(seat);
                    const isSelected = selectedSeat === seat;

                    return (
                      <React.Fragment key={seat}>
                        <Button
                          variant={isSelected ? "contained" : "outlined"}
                          disabled={isOccupied}
                          onClick={() => onSelectSeat(seat)}
                          sx={{
                            minWidth: 40,
                            width: 40,
                            height: 40,
                            p: 0,
                            fontSize: "0.75rem",
                            fontWeight: "bold",
                            backgroundColor: isOccupied
                              ? "#bdbdbd"
                              : isSelected
                              ? "#1976d2"
                              : "white",
                            color: isOccupied
                              ? "#757575"
                              : isSelected
                              ? "white"
                              : "#1976d2",
                            border: isOccupied
                              ? "1px solid #9e9e9e"
                              : isSelected
                              ? "2px solid #1565c0"
                              : "1px solid #1976d2",
                            "&:hover": {
                              backgroundColor: isOccupied
                                ? "#bdbdbd"
                                : isSelected
                                ? "#1565c0"
                                : "#e3f2fd",
                              transform: isOccupied ? "none" : "scale(1.05)",
                            },
                            "&:disabled": {
                              backgroundColor: "#bdbdbd",
                              color: "#757575",
                            },
                            transition: "all 0.2s",
                          }}
                        >
                          {letter}
                        </Button>
                        {letterIndex === 2 && (
                          <Box
                            sx={{
                              width: 24,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{ color: "#999", fontSize: "0.7rem" }}
                            >
                              ||
                            </Typography>
                          </Box>
                        )}
                      </React.Fragment>
                    );
                  })}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Legend */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: "bold" }}>
              Legend:
            </Typography>
            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      border: "1px solid #1976d2",
                      borderRadius: 0.5,
                      backgroundColor: "white",
                    }}
                  />
                  <Typography variant="body2">Available</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#1976d2",
                      borderRadius: 0.5,
                      border: "2px solid #1565c0",
                    }}
                  />
                  <Typography variant="body2">Selected</Typography>
                </Box>
              </Grid>
              <Grid size={{ xs: 12, sm: 4 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      bgcolor: "#bdbdbd",
                      borderRadius: 0.5,
                    }}
                  />
                  <Typography variant="body2">Occupied</Typography>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Cancel
        </Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={!selectedSeat}
        >
          Confirm Seat Selection
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SeatSelectionDialog;
