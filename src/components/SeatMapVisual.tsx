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
        <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 }, flexWrap: "wrap", mb: { xs: 1.5, sm: 2 } }}>
          <Chip
            icon={<EventSeatIcon sx={{ fontSize: { xs: 14, sm: 18 } }} />}
            label="Available"
            size="small"
            variant="outlined"
            sx={{ 
              borderColor: "grey.300", 
              color: "grey.600",
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              height: { xs: 24, sm: 28 }
            }}
          />
          <Chip
            icon={<CheckCircleIcon sx={{ fontSize: { xs: 14, sm: 18 } }} />}
            label="Checked In"
            size="small"
            color="success"
            variant="outlined"
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              height: { xs: 24, sm: 28 }
            }}
          />
          <Chip
            icon={<EventSeatIcon sx={{ fontSize: { xs: 14, sm: 18 } }} />}
            label="Not Checked In"
            size="small"
            variant="outlined"
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              height: { xs: 24, sm: 28 }
            }}
          />
          <Chip
            icon={<AccessibleIcon sx={{ fontSize: { xs: 14, sm: 18 } }} />}
            label="Wheelchair"
            size="small"
            color="warning"
            variant="outlined"
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              height: { xs: 24, sm: 28 }
            }}
          />
          <Chip
            icon={<ChildCareIcon sx={{ fontSize: { xs: 14, sm: 18 } }} />}
            label="Infant"
            size="small"
            color="info"
            variant="outlined"
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              height: { xs: 24, sm: 28 }
            }}
          />
        </Box>
      );
    } else if (mode === "inflight") {
      return (
        <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 }, flexWrap: "wrap", mb: { xs: 1.5, sm: 2 } }}>
          <Chip
            icon={<EventSeatIcon sx={{ fontSize: { xs: 14, sm: 18 } }} />}
            label="Available"
            size="small"
            variant="outlined"
            sx={{ 
              borderColor: "grey.300", 
              color: "grey.600",
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              height: { xs: 24, sm: 28 }
            }}
          />
          <Chip
            icon={<EventSeatIcon sx={{ fontSize: { xs: 14, sm: 18 } }} />}
            label="Regular"
            size="small"
            color="primary"
            variant="outlined"
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              height: { xs: 24, sm: 28 }
            }}
          />
          <Chip
            icon={<RestaurantIcon sx={{ fontSize: { xs: 14, sm: 18 } }} />}
            label="Special Meal"
            size="small"
            color="secondary"
            variant="outlined"
            sx={{ 
              fontSize: { xs: '0.7rem', sm: '0.8125rem' },
              height: { xs: 24, sm: 28 }
            }}
          />
        </Box>
      );
    }
    return null;
  };

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 2.5, md: 3 }, bgcolor: "grey.50" }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: { xs: 1.5, sm: 2 } }}>
        <AirlineSeatReclineExtraIcon color="primary" sx={{ fontSize: { xs: 20, sm: 24 } }} />
        <Typography variant="h6" fontWeight="medium" sx={{ fontSize: { xs: '1rem', sm: '1.15rem', md: '1.25rem' } }}>
          Seat Map
        </Typography>
      </Box>

      {renderLegend()}

      {/* Cabin Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: { xs: 0.75, sm: 1 },
          px: { xs: 2.5, sm: 3, md: 4 },
          color: "text.secondary",
          fontSize: { xs: "0.7rem", sm: "0.8rem", md: "0.85rem" },
          fontWeight: "medium",
        }}
      >
        <Box sx={{ display: "flex", gap: { xs: 2.2, sm: 3.2, md: 4.5 } }}>
          <span>A</span>
          <span>B</span>
          <span>C</span>
        </Box>
        <Box sx={{ display: "flex", gap: { xs: 2.2, sm: 3.2, md: 4.5 } }}>
          <span>D</span>
          <span>E</span>
          <span>F</span>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: { xs: 0.4, sm: 0.75, md: 1 },
          px: { xs: 0.75, sm: 1, md: 1.25 },
          py: { xs: 1.25, sm: 1.75, md: 2 },
          bgcolor: "white",
          borderRadius: 2,
          border: "2px solid",
          borderColor: "primary.light",
          maxHeight: { xs: 380, sm: 500, md: 600 },
          overflowY: "auto",
          overflowX: "hidden",
        }}
      >
        {Array.from({ length: rows }, (_, rowIndex) => (
          <Box
            key={rowIndex}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: { xs: 0.4, sm: 0.75, md: 1 },
              py: { xs: 0.4, sm: 0.6, md: 0.75 },
            }}
          >
            {/* Row Number */}
            <Typography
              sx={{
                minWidth: { xs: 24, sm: 28 },
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
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
                gap: { xs: 0.4, sm: 0.5, md: 0.8 },
                flex: 1,
                justifyContent: "space-between",
              }}
            >
              <Box sx={{ display: "flex", gap: { xs: 0.4, sm: 0.5, md: 0.8 } }}>
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
                          width: { xs: 34, sm: 42, md: 44 },
                          height: { xs: 34, sm: 42, md: 44 },
                          minWidth: { xs: 34, sm: 42, md: 44 },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          borderRadius: { xs: "6px 6px 3px 3px", sm: "8px 8px 4px 4px" },
                          border: { xs: "1.5px solid", sm: "2px solid" },
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
                          <Box sx={{ mb: { xs: -0.3, sm: -0.5 } }}>{seatInfo.icon}</Box>
                        )}
                        <Typography
                          sx={{
                            fontSize: { xs: "0.6rem", sm: "0.625rem", md: "0.65rem" },
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
                  width: { xs: 20, sm: 16, md: 40 },
                  minWidth: { xs: 20, sm: 16, md: 40 },
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "grey.400",
                  fontSize: { xs: "0.6rem", sm: "0.7rem", md: "0.75rem" },
                  fontWeight: "medium",
                }}
              >
                |
              </Box>

              <Box sx={{ display: "flex", gap: { xs: 0.4, sm: 0.5, md: 0.8 } }}>
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
                          width: { xs: 34, sm: 42, md: 44 },
                          height: { xs: 34, sm: 42, md: 44 },
                          minWidth: { xs: 34, sm: 42, md: 44 },
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexDirection: "column",
                          borderRadius: { xs: "6px 6px 3px 3px", sm: "8px 8px 4px 4px" },
                          border: { xs: "1.5px solid", sm: "2px solid" },
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
                          <Box sx={{ mb: { xs: -0.3, sm: -0.5 } }}>{seatInfo.icon}</Box>
                        )}
                        <Typography
                          sx={{
                            fontSize: { xs: "0.6rem", sm: "0.625rem", md: "0.65rem" },
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
                minWidth: { xs: 24, sm: 28 },
                fontSize: { xs: '0.75rem', sm: '0.8rem', md: '0.875rem' },
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
        sx={{ 
          display: "block", 
          mt: { xs: 1.5, sm: 2 }, 
          textAlign: "center",
          fontSize: { xs: '0.7rem', sm: '0.75rem' }
        }}
      >
        {mode === "checkin" ? "Tap" : "Click"} on a seat to view passenger details
      </Typography>
    </Paper>
  );
};

export default SeatMapVisual;
