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
  const getAirportCode = (value?: string) => value?.match(/\(([A-Z]{3})\)/)?.[1] || value || 'N/A';

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
              bgcolor: selectedFlightId === flight.id ? 'primary.50' : 'transparent',
              border: selectedFlightId === flight.id ? '2px solid' : '1px solid transparent',
              borderColor: selectedFlightId === flight.id ? 'primary.main' : 'transparent',
              '&:hover': {
                borderColor: 'primary.light',
                bgcolor: selectedFlightId === flight.id ? 'primary.50' : 'grey.50',
              }
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
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                    {getAirportCode(flight.origin || flight.from)} → {getAirportCode(flight.destination || flight.to)}
                  </Typography>
                  <Typography component="span" variant="body2" color="text.secondary" sx={{ display: 'block' }}>
                    {flight.time || flight.departureTime} • {flight.gate || 'No gate'}
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

export default InFlightFlightList;
