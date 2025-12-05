"use client";

import React from "react";
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Avatar,
  Divider,
} from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import UndoIcon from '@mui/icons-material/Undo';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import AccessibleIcon from '@mui/icons-material/Accessible';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import PersonIcon from '@mui/icons-material/Person';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import { Passenger } from "@/types";

interface PassengerListPanelProps {
  passengers: Passenger[];
  selectedPassengerId: string | undefined;
  onPassengerSelect: (passenger: Passenger) => void;
  onCheckIn: (passengerId: string) => void;
  onUndoCheckIn: (passengerId: string) => void;
  onChangeSeat: (passenger: Passenger) => void;
}

const PassengerListPanel: React.FC<PassengerListPanelProps> = ({
  passengers,
  selectedPassengerId,
  onPassengerSelect,
  onCheckIn,
  onUndoCheckIn,
  onChangeSeat,
}) => {
  const checkedInCount = passengers.filter(p => p.checkedIn).length;
  
  return (
    <Paper elevation={3} sx={{ p: { xs: 1.5, sm: 2 }, height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2, flexWrap: 'wrap', gap: 1 }}>
        <Typography variant="h6" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
          Passengers
        </Typography>
        <Chip 
          label={`${checkedInCount}/${passengers.length} Checked In`}
          color={checkedInCount === passengers.length ? "success" : "default"}
          size="small"
          sx={{ fontSize: { xs: '0.7rem', sm: '0.8rem' } }}
        />
      </Box>
      <List sx={{ pt: 0, overflow: 'auto', flex: 1 }}>
        {passengers.map((passenger, index) => (
          <React.Fragment key={passenger.id}>
            <ListItem 
              disablePadding 
              sx={{ mb: 1 }}
            >
              <ListItemButton
                onClick={() => onPassengerSelect(passenger)}
                selected={selectedPassengerId === passenger.id}
                sx={{ 
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: selectedPassengerId === passenger.id ? 'primary.main' : 'divider',
                  bgcolor: passenger.checkedIn ? 'success.50' : 'background.paper',
                  '&:hover': {
                    borderColor: 'primary.light',
                  },
                  px: 2,
                  py: 1.5,
                }}
              >
                <Box sx={{ width: "100%" }}>
                  {/* Header Row */}
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.75, sm: 1 }, flex: 1 }}>
                      <Avatar sx={{ 
                        width: { xs: 36, sm: 40 }, 
                        height: { xs: 36, sm: 40 }, 
                        bgcolor: passenger.checkedIn ? 'success.main' : 'grey.400' 
                      }}>
                        {passenger.checkedIn ? <CheckCircleIcon fontSize="small" /> : <PersonIcon fontSize="small" />}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <Typography variant="subtitle1" fontWeight="medium" noWrap sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>
                            {passenger.name}
                          </Typography>
                          {passenger.premiumUpgrade && (
                            <Tooltip title="Premium Seat">
                              <StarIcon sx={{ fontSize: { xs: 14, sm: 16 }, color: 'warning.main' }} />
                            </Tooltip>
                          )}
                        </Box>
                        <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center', flexWrap: 'wrap', mt: 0.5 }}>
                          <Chip 
                            label={passenger.seat} 
                            size="small" 
                            color={passenger.premiumUpgrade ? 'warning' : 'default'}
                            variant={passenger.premiumUpgrade ? 'filled' : 'outlined'}
                            sx={{ height: { xs: 18, sm: 20 }, fontSize: { xs: '0.65rem', sm: '0.7rem' }, fontWeight: passenger.premiumUpgrade ? 'bold' : 'normal' }} 
                          />
                          {passenger.groupSeating && (
                            <Tooltip title={`Group: ${passenger.groupSeating.size} passengers`}>
                              <Chip 
                                icon={<GroupIcon sx={{ fontSize: 12 }} />}
                                label={passenger.groupSeating.size}
                                size="small"
                                color="primary"
                                sx={{ height: { xs: 18, sm: 20 }, fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
                              />
                            </Tooltip>
                          )}
                          {passenger.familySeating && (
                            <Tooltip title={`Family: ${passenger.familySeating.adults}A ${passenger.familySeating.children}C${passenger.familySeating.infants ? ` ${passenger.familySeating.infants}I` : ''}`}>
                              <Chip 
                                icon={<FamilyRestroomIcon sx={{ fontSize: 12 }} />}
                                label={`${passenger.familySeating.adults}+${passenger.familySeating.children}`}
                                size="small"
                                color="secondary"
                                sx={{ height: { xs: 18, sm: 20 }, fontSize: { xs: '0.65rem', sm: '0.7rem' } }}
                              />
                            </Tooltip>
                          )}
                          {passenger.wheelchair && (
                            <Tooltip title="Wheelchair Assistance">
                              <AccessibleIcon fontSize="small" color="warning" />
                            </Tooltip>
                          )}
                          {passenger.infant && (
                            <Tooltip title="Traveling with Infant">
                              <ChildCareIcon fontSize="small" color="info" />
                            </Tooltip>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  {/* Services Row */}
                  {passenger.ancillaryServices.length > 0 && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                      {passenger.ancillaryServices.slice(0, 2).join(', ')}
                      {passenger.ancillaryServices.length > 2 && ` +${passenger.ancillaryServices.length - 2} more`}
                    </Typography>
                  )}

                  {/* Action Buttons */}
                  <Box sx={{ display: "flex", gap: { xs: 0.5, sm: 1 }, justifyContent: 'flex-end', mt: { xs: 1, sm: 0.5 } }}>
                    {!passenger.checkedIn ? (
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<CheckCircleIcon sx={{ display: { xs: 'none', sm: 'inline-flex' } }} />}
                        onClick={(e) => {
                          e.stopPropagation();
                          onCheckIn(passenger.id);
                        }}
                        fullWidth
                        sx={{ 
                          minHeight: { xs: 36, sm: 32 },
                          fontSize: { xs: '0.8rem', sm: '0.875rem' }
                        }}
                      >
                        Check In
                      </Button>
                    ) : (
                      <>
                        <Tooltip title="Undo Check-In">
                          <IconButton
                            size="small"
                            color="warning"
                            onClick={(e) => {
                              e.stopPropagation();
                              onUndoCheckIn(passenger.id);
                            }}
                            sx={{ minWidth: { xs: 40, sm: 36 }, minHeight: { xs: 40, sm: 36 } }}
                          >
                            <UndoIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Change Seat">
                          <IconButton
                            size="small"
                            color="primary"
                            onClick={(e) => {
                              e.stopPropagation();
                              onChangeSeat(passenger);
                            }}
                            sx={{ minWidth: { xs: 40, sm: 36 }, minHeight: { xs: 40, sm: 36 } }}
                          >
                            <AirlineSeatReclineExtraIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </>
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

export default PassengerListPanel;
