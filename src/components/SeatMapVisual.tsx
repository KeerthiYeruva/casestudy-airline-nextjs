"use client";

import React from "react";
import { Box, Paper, Chip, Typography, Tooltip } from "@mui/material";
import EventSeatIcon from "@mui/icons-material/EventSeat";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessibleIcon from "@mui/icons-material/Accessible";
import ChildCareIcon from "@mui/icons-material/ChildCare";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import { Passenger } from "@/types";

interface SeatMapVisualProps {
  passengers: Passenger[];
  onSeatClick: (seat: string) => void;
  mode?: "checkin" | "inflight";
}

const SeatMapVisual: React.FC<SeatMapVisualProps> = ({
  passengers,
  onSeatClick,
  mode = "checkin",
}) => {
  const rows = 10;
  const seatsPerRow = ["A", "B", "C", "D", "E", "F"];

  const getSeatInfo = (seat: string) => {
    const passenger = passengers.find((p) => p.seat === seat);
    if (!passenger)
      return {
        status: "available",
        color: "default",
        icon: null,
        passenger: null,
      };

    if (mode === "checkin") {
      if (passenger.wheelchair) {
        return {
          status: "wheelchair",
          color: "warning",
          icon: <AccessibleIcon sx={{ fontSize: 16 }} />,
          passenger,
        };
      }
      if (passenger.infant) {
        return {
          status: "infant",
          color: "info",
          icon: <ChildCareIcon sx={{ fontSize: 16 }} />,
          passenger,
        };
      }
      if (passenger.checkedIn) {
        return {
          status: "checked-in",
          color: "success",
          icon: <CheckCircleIcon sx={{ fontSize: 16 }} />,
          passenger,
        };
      }
      return {
        status: "not-checked-in",
        color: "default",
        icon: <EventSeatIcon sx={{ fontSize: 16 }} />,
        passenger,
      };
    } else if (mode === "inflight") {
      if (passenger.specialMeal && passenger.specialMeal !== "Regular") {
        return {
          status: "special-meal",
          color: "secondary",
          icon: <RestaurantIcon sx={{ fontSize: 16 }} />,
          passenger,
        };
      }
      return {
        status: "regular",
        color: "primary",
        icon: <EventSeatIcon sx={{ fontSize: 16 }} />,
        passenger,
      };
    }

    return {
      status: "available",
      color: "default",
      icon: null,
      passenger: null,
    };
  };

  const renderLegend = () => {
    if (mode === "checkin") {
      return (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <Chip
            icon={<EventSeatIcon />}
            label="Available"
            size="small"
            variant="outlined"
            sx={{ borderColor: "grey.300", color: "grey.600" }}
          />
          <Chip
            icon={<CheckCircleIcon />}
            label="Checked In"
            size="small"
            color="success"
            variant="outlined"
          />
          <Chip
            icon={<EventSeatIcon />}
            label="Not Checked In"
            size="small"
            variant="outlined"
          />
          <Chip
            icon={<AccessibleIcon />}
            label="Wheelchair"
            size="small"
            color="warning"
            variant="outlined"
          />
          <Chip
            icon={<ChildCareIcon />}
            label="Infant"
            size="small"
            color="info"
            variant="outlined"
          />
        </Box>
      );
    } else if (mode === "inflight") {
      return (
        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 2 }}>
          <Chip
            icon={<EventSeatIcon />}
            label="Available"
            size="small"
            variant="outlined"
            sx={{ borderColor: "grey.300", color: "grey.600" }}
          />
          <Chip
            icon={<EventSeatIcon />}
            label="Regular"
            size="small"
            color="primary"
            variant="outlined"
          />
          <Chip
            icon={<RestaurantIcon />}
            label="Special Meal"
            size="small"
            color="secondary"
            variant="outlined"
          />
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, bgcolor: "grey.50" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
        <AirlineSeatReclineExtraIcon color="primary" />
        <Typography variant="h6" fontWeight="medium">
          Seat Map
        </Typography>
      </Box>

      {renderLegend()}

      {/* Cabin Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 1,
          px: { xs: 3, sm: 4 },
          color: "text.secondary",
          fontSize: { xs: "0.75rem", sm: "0.85rem" },
          fontWeight: "medium",
        }}
      >
        <Box sx={{ display: "flex", gap: { xs: 2.5, sm: 4.5 } }}>
          <span>A</span>
          <span>B</span>
          <span>C</span>
        </Box>
        <Box sx={{ display: "flex", gap: { xs: 2.5, sm: 4.5 } }}>
          <span>D</span>
          <span>E</span>
          <span>F</span>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 0.5, sm: 1 },
          px: 1,
          py: { xs: 1.5, sm: 2 },
          bgcolor: "white",
          borderRadius: 2,
          border: "2px solid",
          borderColor: "primary.light",
          maxHeight: { xs: 450, sm: 600 },
          overflowY: "auto",
        }}
      >
        {Array.from({ length: rows }, (_, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.5, sm: 1 },
              py: { xs: 0.5, sm: 0.75 },
            }}
          >
            {/* Row Number */}
            <Typography
              sx={{
                minWidth: 28,
                fontSize: "0.875rem",
                fontWeight: "bold",
                color: "primary.main",
                textAlign: "center",
              }}
            >
              {rowIndex + 1}
            </Typography>

            {/* Seats */}
            <Box
              sx={{
                display: "flex",
                gap: { xs: 0.5, sm: 0.8 },
                flex: 1,
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 0.8 } }}>
                {seatsPerRow.slice(0, 3).map((seatLetter) => {
                  const seatNumber = `${rowIndex + 1}${seatLetter}`;
                  const seatInfo = getSeatInfo(seatNumber);

                  return (
                    <Tooltip
                      key={seatNumber}
                      title={
                        seatInfo.passenger
                          ? `${seatNumber} - ${seatInfo.passenger.name}`
                          : `${seatNumber} - Available`
                      }
                      arrow
                    >
                      <Box
                        onClick={() => onSeatClick(seatNumber)}
                        sx={{
                          width: { xs: 36, sm: 44 },
                          height: { xs: 36, sm: 44 },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          borderRadius: "8px 8px 4px 4px",
                          border: "2px solid",
                          borderColor: seatInfo.passenger
                            ? `${seatInfo.color}.main`
                            : "grey.300",
                          bgcolor: seatInfo.passenger
                            ? `${seatInfo.color}.50`
                            : "white",
                          cursor:
                            mode === "inflight" && !seatInfo.passenger
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            mode === "inflight" && !seatInfo.passenger
                              ? 0.4
                              : 1,
                          transition: "all 0.2s",
                          "&:hover": {
                            transform:
                              mode === "inflight" && !seatInfo.passenger
                                ? "none"
                                : "translateY(-2px)",
                            boxShadow:
                              mode === "inflight" && !seatInfo.passenger
                                ? "none"
                                : 2,
                            borderColor: seatInfo.passenger
                              ? `${seatInfo.color}.dark`
                              : "primary.main",
                          },
                        }}
                      >
                        {seatInfo.icon && (
                          <Box sx={{ mb: -0.5 }}>{seatInfo.icon}</Box>
                        )}
                        <Typography
                          sx={{
                            fontSize: "0.65rem",
                            fontWeight: "bold",
                            color: seatInfo.passenger
                              ? `${seatInfo.color}.dark`
                              : "text.secondary",
                          }}
                        >
                          {seatLetter}
                        </Typography>
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>

              {/* Aisle */}
              <Box
                sx={{
                  width: { xs: 24, sm: 40 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "grey.400",
                  fontSize: { xs: "0.65rem", sm: "0.75rem" },
                  fontWeight: "medium",
                }}
              >
                |
              </Box>

              <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 0.8 } }}>
                {seatsPerRow.slice(3, 6).map((seatLetter) => {
                  const seatNumber = `${rowIndex + 1}${seatLetter}`;
                  const seatInfo = getSeatInfo(seatNumber);

                  return (
                    <Tooltip
                      key={seatNumber}
                      title={
                        seatInfo.passenger
                          ? `${seatNumber} - ${seatInfo.passenger.name}`
                          : `${seatNumber} - Available`
                      }
                      arrow
                    >
                      <Box
                        onClick={() => onSeatClick(seatNumber)}
                        sx={{
                         width: { xs: 36, sm: 44 },
                          height: { xs: 36, sm: 44 },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          borderRadius: "8px 8px 4px 4px",
                          border: "2px solid",
                          borderColor: seatInfo.passenger
                            ? `${seatInfo.color}.main`
                            : "grey.300",
                          bgcolor: seatInfo.passenger
                            ? `${seatInfo.color}.50`
                            : "white",
                          cursor:
                            mode === "inflight" && !seatInfo.passenger
                              ? "not-allowed"
                              : "pointer",
                          opacity:
                            mode === "inflight" && !seatInfo.passenger
                              ? 0.4
                              : 1,
                          transition: "all 0.2s",
                          "&:hover": {
                            transform:
                              mode === "inflight" && !seatInfo.passenger
                                ? "none"
                                : "translateY(-2px)",
                            boxShadow:
                              mode === "inflight" && !seatInfo.passenger
                                ? "none"
                                : 2,
                            borderColor: seatInfo.passenger
                              ? `${seatInfo.color}.dark`
                              : "primary.main",
                          },
                        }}
                      >
                        {seatInfo.icon && (
                          <Box sx={{ mb: -0.5 }}>{seatInfo.icon}</Box>
                        )}
                        <Typography
                          sx={{
                            fontSize: "0.65rem",
                            fontWeight: "bold",
                            color: seatInfo.passenger
                              ? `${seatInfo.color}.dark`
                              : "text.secondary",
                          }}
                        >
                          {seatLetter}
                        </Typography>
                      </Box>
                    </Tooltip>
                  );
                })}
              </Box>
            </Box>

            {/* Row Number (right side) */}
            <Typography
               sx={{
                minWidth: 28,
                fontSize: "0.875rem",
                fontWeight: "bold",
                color: "primary.main",
                textAlign: "center",
              }}
            >
              {rowIndex + 1}
            </Typography>
          </Box>
        ))}
      </Box>

      {/* Footer info */}
      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ display: "block", mt: 2, textAlign: "center" }}
      >
        Click on a seat to view passenger details
      </Typography>
    </Paper>
  );
};

export default SeatMapVisual;
