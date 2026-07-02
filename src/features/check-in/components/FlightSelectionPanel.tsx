"use client";

import React, { useState } from "react";
import { Paper, Typography, List, ListItemButton, Box, Button, Chip, Collapse, LinearProgress, Stack } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import StarIcon from "@mui/icons-material/Star";
import GroupIcon from "@mui/icons-material/Group";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import StatusChip from "../../../shared/components/ui/StatusChip";
import type { Flight } from "../../../domain/flights/types";
import type { Passenger } from "../../../domain/passengers/types";

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
  const [showResponsiveList, setShowResponsiveList] = useState(false);
  const selectedFlight = flights.find((flight) => flight.id === selectedFlightId);

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

  const handleFlightSelect = (flight: Flight) => {
    onFlightSelect(flight);
    setShowResponsiveList(false);
  };

  const selectedStats = selectedFlight ? getFlightStats(selectedFlight.id) : null;

  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1, mb: 1 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <FlightTakeoffIcon />
          Select Flight
        </Typography>
        {selectedFlight && (
          <Button
            size="small"
            endIcon={showResponsiveList ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            onClick={() => setShowResponsiveList((open) => !open)}
            sx={{ display: { xs: 'inline-flex', md: 'none' }, whiteSpace: 'nowrap' }}
          >
            {showResponsiveList ? 'Hide' : 'Change'}
          </Button>
        )}
      </Box>

      {selectedFlight && selectedStats && (
        <Box
          sx={{
            display: { xs: 'block', md: 'none' },
            p: 1.25,
            mb: showResponsiveList ? 1 : 0,
            borderRadius: 1,
            border: '1px solid',
            borderColor: 'primary.light',
            bgcolor: 'primary.50',
          }}
        >
          <Stack direction="row" spacing={1} sx={{ alignItems: 'center', justifyContent: 'space-between', mb: 0.75 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>
              {selectedFlight.flightNumber}
            </Typography>
            <StatusChip status={selectedFlight.status} />
          </Stack>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.25 }}>
            {selectedFlight.origin || selectedFlight.from} → {selectedFlight.destination || selectedFlight.to}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {selectedFlight.time || selectedFlight.departureTime} • Gate {selectedFlight.gate} • {selectedStats.occupiedSeats}/{selectedStats.totalSeats} seats
          </Typography>
        </Box>
      )}

      <Collapse in={!selectedFlight || showResponsiveList} sx={{ display: { xs: 'block', md: 'none' } }}>
        <List sx={{ pt: selectedFlight ? 0.5 : 0 }}>
          {flights.map((flight, flightIndex) => {
            const stats = getFlightStats(flight.id);
            
            return (
              <ListItemButton
                key={`${flight.id}-${flightIndex}`}
                selected={selectedFlightId === flight.id}
                onClick={() => handleFlightSelect(flight)}
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
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                      {flight.flightNumber}
                    </Typography>
                    <StatusChip status={flight.status} />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                    {flight.origin || flight.from} → {flight.destination || flight.to}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                    {flight.time || flight.departureTime} • Gate {flight.gate}
                  </Typography>

                  <Box sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="caption" color="text.secondary">
                        Capacity
                      </Typography>
                      <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
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

                  {(stats.premiumCount > 0 || stats.groupCount > 0 || stats.familyCount > 0) && (
                    <Stack direction="row" spacing={0.5} sx={{ flexWrap: 'wrap' }}>
                      {stats.premiumCount > 0 && (
                        <Chip icon={<StarIcon sx={{ fontSize: 14 }} />} label={stats.premiumCount} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'warning.100' }} />
                      )}
                      {stats.groupCount > 0 && (
                        <Chip icon={<GroupIcon sx={{ fontSize: 14 }} />} label={stats.groupCount} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'primary.100' }} />
                      )}
                      {stats.familyCount > 0 && (
                        <Chip icon={<FamilyRestroomIcon sx={{ fontSize: 14 }} />} label={stats.familyCount} size="small" sx={{ height: 20, fontSize: '0.7rem', bgcolor: 'secondary.100' }} />
                      )}
                    </Stack>
                  )}
                </Box>
              </ListItemButton>
            );
          })}
        </List>
      </Collapse>

      <List sx={{ pt: 0, display: { xs: 'none', md: 'block' } }}>
        {flights.map((flight, flightIndex) => {
          const stats = getFlightStats(flight.id);
          
          return (
            <ListItemButton
              key={`${flight.id}-${flightIndex}`}
              selected={selectedFlightId === flight.id}
              onClick={() => handleFlightSelect(flight)}
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
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {flight.flightNumber}
                  </Typography>
                  <StatusChip status={flight.status} />
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
                    <Typography variant="caption" sx={{ fontWeight: 'bold' }}>
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
