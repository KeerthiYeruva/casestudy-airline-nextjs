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
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import type { Passenger } from "../../../domain/passengers/types";

interface InFlightPassengerListProps {
  passengers: Passenger[];
  selectedPassengerId: string | undefined;
  onPassengerSelect: (passenger: Passenger) => void;
  embedded?: boolean;
}

const InFlightPassengerList: React.FC<InFlightPassengerListProps> = ({
  passengers,
  selectedPassengerId,
  onPassengerSelect,
  embedded = false,
}) => {
  const content = (
    <>
      {!embedded && (
        <Typography variant="h6" gutterBottom>
          Passengers ({passengers.length})
        </Typography>
      )}
      {embedded && passengers.length === 0 && (
        <Typography variant="body2" color="text.secondary">
          No passengers match this search.
        </Typography>
      )}
      <List sx={{ pt: 0, overflowY: 'auto', overflowX: 'hidden', flex: 1, minWidth: 0, minHeight: 0, maxHeight: { xs: 360, sm: 420, md: 480, lg: 'calc(100vh - 260px)' } }}>
        {passengers.map((passenger, index) => (
          <React.Fragment key={passenger.id}>
            <ListItem disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                onClick={() => onPassengerSelect(passenger)}
                selected={selectedPassengerId === passenger.id}
                sx={{ 
                  borderRadius: 1,
                  bgcolor: selectedPassengerId === passenger.id ? 'primary.50' : 'background.paper',
                  border: '1px solid',
                  borderColor: selectedPassengerId === passenger.id ? 'primary.main' : 'divider',
                  '&:hover': {
                    borderColor: 'primary.light',
                    bgcolor: selectedPassengerId === passenger.id ? 'primary.50' : 'grey.50',
                  },
                  px: { xs: 1.25, sm: 2 },
                  py: 1.5,
                  minWidth: 0,
                }}
              >
                <Box sx={{ width: "100%", minWidth: 0 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1, gap: 1, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 1.5 }, flex: '1 1 160px', minWidth: 0 }}>
                      <Avatar sx={{ width: 36, height: 36, bgcolor: 'primary.main' }}>
                        <PersonIcon fontSize="small" />
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }} noWrap>
                          {passenger.name}
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mt: 0.5 }}>
                          <Chip label={passenger.seat} size="small" />
                          <Chip label={passenger.bookingReference} size="small" variant="outlined" />
                        </Box>
                      </Box>
                    </Box>
                    <Box sx={{ display: 'flex', gap: 0.5, flex: '0 1 auto', flexWrap: 'wrap', justifyContent: 'flex-end', minWidth: 0 }}>
                      {passenger.premiumUpgrade && (
                        <StarIcon fontSize="small" sx={{ color: 'warning.main' }} />
                      )}
                      {passenger.groupSeating && (
                        <GroupIcon fontSize="small" color="action" />
                      )}
                      {passenger.familySeating && (
                        <FamilyRestroomIcon fontSize="small" color="action" />
                      )}
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
                  
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1, minWidth: 0 }}>
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, minWidth: 0 }}>
                      <RestaurantIcon sx={{ fontSize: 14 }} />
                      {passenger.specialMeal || 'No meal'}
                    </Typography>
                    {passenger.ancillaryServices.length > 0 && (
                      <Chip 
                        label={`${passenger.ancillaryServices.length} services`} 
                        size="small" 
                        variant="outlined"
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
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <Paper elevation={3} sx={{ p: 2, height: '100%', display: 'flex', flexDirection: 'column', minWidth: 0 }}>
      {content}
    </Paper>
  );
};

export default InFlightPassengerList;
