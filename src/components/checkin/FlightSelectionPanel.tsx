"use client";

import React from "react";
import { Paper, Typography, List, ListItemButton, ListItemText, Box, Chip, LinearProgress, Stack } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import StarIcon from "@mui/icons-material/Star";
import GroupIcon from "@mui/icons-material/Group";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import { Flight, Passenger } from "@/types";

interface FlightSelectionPanelProps {
  flights: Flight[];
  selectedFlightId: string | undefined;
  onFlightSelect: (flight: Flight) => void;
  passengers?: Passenger[];
}

const FlightSelectionPanel: React.FC<FlightSelectionPanelProps> = ({
  flights,
  selectedFlightId,
  onFlightSelect,
  passengers = [],
}) => {
  const getFlightStats = (flightId: string) => {
    const flightPassengers = passengers.filter(p => p.flightId === flightId);
    const totalSeats = 60; // Default capacity
    const occupiedSeats = flightPassengers.length;
    const occupancyRate = (occupiedSeats / totalSeats) * 100;
    const premiumCount = flightPassengers.filter(p => p.premiumUpgrade).length;
    const groupCount = new Set(flightPassengers.filter(p => p.groupSeating).map(p => p.groupSeating?.groupId)).size;
    const familyCount = new Set(flightPassengers.filter(p => p.familySeating).map(p => p.familySeating?.familyId)).size;
    
    return { occupiedSeats, totalSeats, occupancyRate, premiumCount, groupCount, familyCount };
  };

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FlightTakeoffIcon />
        Select Flight
      </Typography>
      <List sx={{ pt: 0 }}>
        {flights.map((flight) => {
          const stats = getFlightStats(flight.id);
          
          return (
            <ListItemButton
              key={flight.id}
              selected={selectedFlightId === flight.id}
              onClick={() => onFlightSelect(flight)}
              sx={{ 
                borderRadius: 1, 
                mb: 1,
                border: selectedFlightId === flight.id ? '2px solid' : '1px solid',
                borderColor: selectedFlightId === flight.id ? 'primary.main' : 'divider',
                bgcolor: selectedFlightId === flight.id ? 'primary.50' : 'transparent',
                '&:hover': { 
                  borderColor: 'primary.light',
                  bgcolor: selectedFlightId === flight.id ? 'primary.50' : 'action.hover'
                },
                p: 1.5
              }}
            >
              <Box sx={{ width: '100%' }}>
                {/* Header */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                  <Typography variant="subtitle1" fontWeight="bold">
                    {flight.flightNumber}
                  </Typography>
                  <Chip 
                    label={flight.status} 
                    size="small" 
                    color={flight.status === 'On Time' ? 'success' : flight.status === 'Boarding' ? 'warning' : 'error'}
                  />
                </Box>

                {/* Route and Time */}
                <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                  {flight.origin || flight.from} → {flight.destination || flight.to}
                </Typography>
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                  {flight.time || flight.departureTime} • Gate {flight.gate}
                </Typography>

                {/* Capacity Bar */}
                <Box sx={{ mb: 1 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="caption" color="text.secondary">
                      Capacity
                    </Typography>
                    <Typography variant="caption" fontWeight="bold">
                      {stats.occupiedSeats}/{stats.totalSeats}
                    </Typography>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={stats.occupancyRate} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 1,
                      bgcolor: 'grey.200',
                      '& .MuiLinearProgress-bar': {
                        bgcolor: stats.occupancyRate > 80 ? 'error.main' : stats.occupancyRate > 60 ? 'warning.main' : 'success.main'
                      }
                    }}
                  />
                </Box>

                {/* Seat Management Indicators */}
                {(stats.premiumCount > 0 || stats.groupCount > 0 || stats.familyCount > 0) && (
                  <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                    {stats.premiumCount > 0 && (
                      <Chip 
                        icon={<StarIcon sx={{ fontSize: 14 }} />}
                        label={stats.premiumCount}
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'warning.100' }}
                      />
                    )}
                    {stats.groupCount > 0 && (
                      <Chip 
                        icon={<GroupIcon sx={{ fontSize: 14 }} />}
                        label={stats.groupCount}
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'primary.100' }}
                      />
                    )}
                    {stats.familyCount > 0 && (
                      <Chip 
                        icon={<FamilyRestroomIcon sx={{ fontSize: 14 }} />}
                        label={stats.familyCount}
                        size="small"
                        sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'secondary.100' }}
                      />
                    )}
                  </Stack>
                )}
              </Box>
            </ListItemButton>
          );
        })}
      </List>
    </Paper>
  );
};

export default FlightSelectionPanel;
