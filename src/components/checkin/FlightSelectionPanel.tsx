"use client";

import React from "react";
import { Paper, Typography, List, ListItemButton, ListItemText, Box, Chip } from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import { Flight } from "@/types";

interface FlightSelectionPanelProps {
  flights: Flight[];
  selectedFlightId: string | undefined;
  onFlightSelect: (flight: Flight) => void;
}

const FlightSelectionPanel: React.FC<FlightSelectionPanelProps> = ({
  flights,
  selectedFlightId,
  onFlightSelect,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FlightTakeoffIcon />
        Select Flight
      </Typography>
      <List sx={{ pt: 0 }}>
        {flights.map((flight) => (
          <ListItemButton
            key={flight.id}
            selected={selectedFlightId === flight.id}
            onClick={() => onFlightSelect(flight)}
            sx={{ 
              borderRadius: 1, 
              mb: 1,
              border: selectedFlightId === flight.id ? '2px solid' : '1px solid transparent',
              borderColor: selectedFlightId === flight.id ? 'primary.main' : 'transparent',
              '&:hover': { borderColor: 'primary.light' }
            }}
          >
            <ListItemText
              primary={
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
              }
              secondary={
                <Box sx={{ mt: 0.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {flight.origin || flight.from} → {flight.destination || flight.to}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {flight.time || flight.departureTime} • Gate {flight.gate}
                  </Typography>
                </Box>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default FlightSelectionPanel;
