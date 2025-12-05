"use client";

import React from "react";
import { Paper, Typography, Chip, Box, Grid, Divider, Avatar, Button, Stack } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessibleIcon from '@mui/icons-material/Accessible';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import GroupIcon from '@mui/icons-material/Group';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import StarIcon from '@mui/icons-material/Star';
import { Passenger } from "@/types";

interface PassengerDetailsPanelProps {
  passenger: Passenger;
  onSetPreferences?: () => void;
  onOfferPremiumUpgrade?: () => void;
}

const PassengerDetailsPanel: React.FC<PassengerDetailsPanelProps> = ({
  passenger,
  onSetPreferences,
  onOfferPremiumUpgrade,
}) => {
  return (
    <Paper elevation={3} sx={{ mt: 2, p: { xs: 2, sm: 3 }, bgcolor: passenger.checkedIn ? 'success.50' : 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1.5, sm: 2 }, mb: { xs: 2, sm: 3 } }}>
        <Avatar sx={{ 
          width: { xs: 48, sm: 56 }, 
          height: { xs: 48, sm: 56 }, 
          bgcolor: passenger.checkedIn ? 'success.main' : 'primary.main' 
        }}>
          {passenger.checkedIn ? <CheckCircleIcon fontSize="large" /> : <PersonIcon fontSize="large" />}
        </Avatar>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }} noWrap>
            {passenger.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, flexWrap: 'wrap' }}>
            <Chip 
              label={passenger.checkedIn ? "Checked In" : "Not Checked In"}
              color={passenger.checkedIn ? "success" : "default"}
              size="small"
              icon={passenger.checkedIn ? <CheckCircleIcon /> : undefined}
            />
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: { xs: 1.5, sm: 2 } }} />

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, mb: 0.5, flexWrap: 'wrap' }}>
            <AirlineSeatReclineExtraIcon fontSize="small" color="action" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
            <Typography variant="caption" color="text.secondary" fontWeight="medium" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Seat
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight="bold" sx={{ fontSize: { xs: '1.25rem', sm: '1.5rem' } }}>{passenger.seat}</Typography>
        </Grid>
        
        <Grid size={{ xs: 6, sm: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 }, mb: 0.5, flexWrap: 'wrap' }}>
            <ConfirmationNumberIcon fontSize="small" color="action" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }} />
            <Typography variant="caption" color="text.secondary" fontWeight="medium" sx={{ fontSize: { xs: '0.65rem', sm: '0.75rem' } }}>
              Booking Reference
            </Typography>
          </Box>
          <Typography variant="body1" fontWeight="medium" sx={{ fontSize: { xs: '0.9rem', sm: '1rem' } }}>{passenger.bookingReference}</Typography>
        </Grid>

        {passenger.specialMeal && (
          <Grid size={{ xs: 12, sm: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <RestaurantIcon fontSize="small" color="action" />
              <Typography variant="caption" color="text.secondary" fontWeight="medium">
                Special Meal
              </Typography>
            </Box>
            <Typography variant="body1" fontWeight="medium">{passenger.specialMeal}</Typography>
          </Grid>
        )}
      </Grid>

      {(passenger.wheelchair || passenger.infant) && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Special Requirements
            </Typography>
            <Box sx={{ display: "flex", gap: 1, mt: 1 }}>
              {passenger.wheelchair && (
                <Chip 
                  label="Wheelchair Assistance" 
                  color="warning" 
                  icon={<AccessibleIcon />}
                  variant="outlined"
                />
              )}
              {passenger.infant && (
                <Chip 
                  label="Traveling with Infant" 
                  color="info" 
                  icon={<ChildCareIcon />}
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </>
      )}

      {passenger.ancillaryServices.length > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Ancillary Services ({passenger.ancillaryServices.length})
            </Typography>
            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
              {passenger.ancillaryServices.map((service) => (
                <Chip key={service} label={service} variant="outlined" color="primary" />
              ))}
            </Box>
          </Box>
        </>
      )}

      {/* Seat Management Information */}
      {(passenger.seatPreferences || passenger.groupSeating || passenger.familySeating || passenger.premiumUpgrade) && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box>
            <Typography variant="subtitle1" fontWeight="bold" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AirlineSeatReclineExtraIcon color="primary" />
              Seat Management
            </Typography>
            
            {/* Premium Upgrade Badge */}
            {passenger.premiumUpgrade && (
              <Box sx={{ 
                bgcolor: 'warning.50', 
                border: '2px solid',
                borderColor: 'warning.main',
                borderRadius: 2, 
                p: 2, 
                mb: 2,
                boxShadow: 1
              }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                  <StarIcon color="warning" />
                  <Typography variant="subtitle2" fontWeight="bold" color="warning.dark">
                    Premium Seat Upgrade
                  </Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  This passenger has been upgraded to a premium seat with enhanced comfort and exclusive benefits.
                </Typography>
              </Box>
            )}

            {/* Seat Preferences */}
            {passenger.seatPreferences && (
              <Box sx={{ 
                bgcolor: 'primary.50', 
                borderRadius: 2, 
                p: 1.5, 
                mb: 1.5,
                border: '1px solid',
                borderColor: 'primary.light'
              }}>
                <Typography variant="caption" fontWeight="bold" color="primary.dark" display="block" mb={0.5}>
                  SEAT PREFERENCES
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                  {passenger.seatPreferences.position && passenger.seatPreferences.position.length > 0 && (
                    <Chip 
                      label={`Position: ${passenger.seatPreferences.position.join(', ')}`}
                      size="small"
                      sx={{ bgcolor: 'white', fontSize: '0.75rem' }}
                    />
                  )}
                  {passenger.seatPreferences.type && (
                    <Chip 
                      label={`Type: ${passenger.seatPreferences.type}`}
                      size="small"
                      sx={{ bgcolor: 'white', fontSize: '0.75rem' }}
                    />
                  )}
                  {passenger.seatPreferences.nearFamily && (
                    <Chip 
                      label="Near Family"
                      size="small"
                      icon={<FamilyRestroomIcon sx={{ fontSize: 14 }} />}
                      sx={{ bgcolor: 'white', fontSize: '0.75rem' }}
                    />
                  )}
                </Box>
              </Box>
            )}

            {/* Group Seating */}
            {passenger.groupSeating && (
              <Box sx={{ 
                bgcolor: 'secondary.50', 
                borderRadius: 2, 
                p: 1.5, 
                mb: 1.5,
                border: '1px solid',
                borderColor: 'secondary.light'
              }}>
                <Typography variant="caption" fontWeight="bold" color="secondary.dark" display="block" mb={0.5}>
                  GROUP SEATING
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<GroupIcon sx={{ fontSize: 14 }} />}
                    label={`${passenger.groupSeating.size} passengers`}
                    size="small"
                    color="secondary"
                    sx={{ fontSize: '0.75rem' }}
                  />
                  {passenger.groupSeating.keepTogether && (
                    <Chip 
                      label="Keep Together"
                      size="small"
                      sx={{ bgcolor: 'white', fontSize: '0.75rem' }}
                    />
                  )}
                  <Typography variant="caption" color="text.secondary">
                    ID: {passenger.groupSeating.groupId}
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Family Seating */}
            {passenger.familySeating && (
              <Box sx={{ 
                bgcolor: 'info.50', 
                borderRadius: 2, 
                p: 1.5, 
                mb: 1.5,
                border: '1px solid',
                borderColor: 'info.light'
              }}>
                <Typography variant="caption" fontWeight="bold" color="info.dark" display="block" mb={0.5}>
                  FAMILY SEATING
                </Typography>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', alignItems: 'center' }}>
                  <Chip 
                    label={`${passenger.familySeating.adults} Adults`}
                    size="small"
                    sx={{ bgcolor: 'white', fontSize: '0.75rem' }}
                  />
                  <Chip 
                    label={`${passenger.familySeating.children} Children`}
                    size="small"
                    sx={{ bgcolor: 'white', fontSize: '0.75rem' }}
                  />
                  {passenger.familySeating.infants && passenger.familySeating.infants > 0 && (
                    <Chip 
                      label={`${passenger.familySeating.infants} Infants`}
                      size="small"
                      sx={{ bgcolor: 'white', fontSize: '0.75rem' }}
                    />
                  )}
                  {passenger.familySeating.autoAllocate && (
                    <Chip 
                      label="Auto-Allocated"
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ fontSize: '0.75rem' }}
                    />
                  )}
                </Box>
                <Typography variant="caption" color="text.secondary" display="block" mt={0.5}>
                  Family ID: {passenger.familySeating.familyId}
                </Typography>
              </Box>
            )}
            
            {/* Seat Management Actions */}
            {!passenger.checkedIn && (
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1} sx={{ mt: 2 }}>
                {onSetPreferences && (
                  <Button
                    variant="outlined"
                    size="medium"
                    startIcon={<AirlineSeatReclineExtraIcon />}
                    onClick={onSetPreferences}
                    fullWidth
                    sx={{ fontWeight: 'bold' }}
                  >
                    Set Preferences
                  </Button>
                )}
                {onOfferPremiumUpgrade && !passenger.premiumUpgrade && (
                  <Button
                    variant="contained"
                    size="medium"
                    startIcon={<StarIcon />}
                    onClick={onOfferPremiumUpgrade}
                    color="warning"
                    fullWidth
                    sx={{ fontWeight: 'bold' }}
                  >
                    Offer Upgrade
                  </Button>
                )}
              </Stack>
            )}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default PassengerDetailsPanel;
