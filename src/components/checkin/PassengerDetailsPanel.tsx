"use client";

import React from "react";
import { Paper, Typography, Chip, Box, Grid, Divider, Avatar } from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessibleIcon from '@mui/icons-material/Accessible';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import { Passenger } from "@/types";

interface PassengerDetailsPanelProps {
  passenger: Passenger;
}

const PassengerDetailsPanel: React.FC<PassengerDetailsPanelProps> = ({
  passenger,
}) => {
  return (
    <Paper elevation={3} sx={{ mt: 2, p: 3, bgcolor: passenger.checkedIn ? 'success.50' : 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: passenger.checkedIn ? 'success.main' : 'primary.main' }}>
          {passenger.checkedIn ? <CheckCircleIcon fontSize="large" /> : <PersonIcon fontSize="large" />}
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="bold">
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

      <Divider sx={{ mb: 2 }} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 6, sm: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <AirlineSeatReclineExtraIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary" fontWeight="medium">
              Seat
            </Typography>
          </Box>
          <Typography variant="h6" fontWeight="bold">{passenger.seat}</Typography>
        </Grid>
        
        <Grid size={{ xs: 6, sm: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <ConfirmationNumberIcon fontSize="small" color="action" />
            <Typography variant="caption" color="text.secondary" fontWeight="medium">
              Booking Reference
            </Typography>
          </Box>
          <Typography variant="body1" fontWeight="medium">{passenger.bookingReference}</Typography>
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
    </Paper>
  );
};

export default PassengerDetailsPanel;
