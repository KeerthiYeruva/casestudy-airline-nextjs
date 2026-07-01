"use client";

import React from "react";
import { Paper, Typography, List, ListItemButton, ListItemText, Box } from "@mui/material";
import FlightIcon from "@mui/icons-material/Flight";
import StatusChip from "@/components/ui/StatusChip";
import type { Flight } from "@/types/flight";

interface InFlightFlightListProps {
  flights: Flight[];
  selectedFlightId: string | undefined;
  onFlightSelect: (flight: Flight) => void;
}

const InFlightFlightList: React.FC<InFlightFlightListProps> = ({
  flights,
  selectedFlightId,
  onFlightSelect,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2 }}>
      <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <FlightIcon />
        Active Flights
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
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                    {flight.flightNumber}
                  </Typography>
                  <StatusChip status={flight.status} />
                </Box>
              }
              secondary={
                <Box component="span" sx={{ mt: 0.5, display: 'block' }}>
                  <Box component="span" sx={{ display: 'block', fontSize: '0.875rem', color: 'text.secondary' }}>
                    {flight.origin || flight.from} → {flight.destination || flight.to}
                  </Box>
                  <Box component="span" sx={{ display: 'block', fontSize: '0.875rem', color: 'text.secondary' }}>
                    {flight.time || flight.departureTime} • Gate {flight.gate}
                  </Box>
                </Box>
              }
            />
          </ListItemButton>
        ))}
      </List>
    </Paper>
  );
};

export default InFlightFlightList;
