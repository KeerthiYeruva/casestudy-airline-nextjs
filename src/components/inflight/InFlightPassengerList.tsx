"use client";

import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Chip,
  Box,
  Avatar,
  Badge,
  Divider,
} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import { Passenger } from "@/types";

interface InFlightPassengerListProps {
  passengers: Passenger[];
  selectedPassengerId: string | undefined;
  onPassengerSelect: (passenger: Passenger) => void;
}

const InFlightPassengerList: React.FC<InFlightPassengerListProps> = ({
  passengers,
  selectedPassengerId,
  onPassengerSelect,
}) => {
  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Typography variant="h6" gutterBottom>
        Passengers ({passengers.length})
      </Typography>
      <List sx={{ pt: 0, overflow: 'auto', flex: 1 }}>
        {passengers.map((passenger, index) => (
          <React.Fragment key={passenger.id}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => onPassengerSelect(passenger)}
                selected={selectedPassengerId === passenger.id}
                sx={{ 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: selectedPassengerId === passenger.id ? 'primary.main' : 'divider',
                  '&:hover': {
                    borderColor: 'primary.light',
                  },
                  px: 2,
                  py: 1.5,
                }}
              >
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, flex: 1 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight="medium" noWrap>
                          {passenger.name}
                        </Typography>
                        <Chip label={passenger.seat} size="small" sx={{ height: 20, fontSize: '0.7rem', mt: 0.5 }} />
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5 }}>
                      {passenger.specialMeal && (
                        <Badge badgeContent={1} color="info">
                          <RestaurantIcon fontSize="small" color="action" />
                        </Badge>
                      )}
                      {passenger.shopRequests && passenger.shopRequests.length > 0 && (
                        <Badge badgeContent={passenger.shopRequests.length} color="secondary">
                          <LocalMallIcon fontSize="small" color="action" />
                        </Badge>
                      )}
                    </Box>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <RestaurantIcon sx={{ fontSize: 14 }} />
                      {passenger.specialMeal || 'No meal'}
                    </Typography>
                    {passenger.ancillaryServices.length > 0 && (
                      <Chip 
                        label={`${passenger.ancillaryServices.length} services`} 
                        size="small" 
                        variant="outlined"
                        sx={{ height: 20, fontSize: '0.7rem' }}
                      />
                    )}
                  </Box>
                </Box>
              </ListItemButton>
            </ListItem>
            {index < passengers.length - 1 && <Divider sx={{ my: 0.5 }} />}
          </React.Fragment>
        ))}
      </List>
    </Paper>
  );
};

export default InFlightPassengerList;
