'use client';

/**
 * Seat Arrangement Summary Component
 * Displays visual statistics about seat arrangements, occupancy, and special seating
 */

import React from 'react';
import {
  Paper,
  Typography,
  Box,
  Grid,
  LinearProgress,
  Chip,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import EventSeatIcon from '@mui/icons-material/EventSeat';
import StarIcon from '@mui/icons-material/Star';
import GroupIcon from '@mui/icons-material/Group';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PendingIcon from '@mui/icons-material/Pending';
import { Passenger } from '@/types';

interface SeatArrangementSummaryProps {
  passengers: Passenger[];
  totalSeats?: number;
}

const SeatArrangementSummary: React.FC<SeatArrangementSummaryProps> = ({
  passengers,
  totalSeats = 60
}) => {
  // Calculate statistics
  const occupiedSeats = passengers.length;
  const availableSeats = totalSeats - occupiedSeats;
  const occupancyRate = (occupiedSeats / totalSeats) * 100;
  
  const checkedInCount = passengers.filter(p => p.checkedIn).length;
  const notCheckedInCount = occupiedSeats - checkedInCount;
  const checkInRate = occupiedSeats > 0 ? (checkedInCount / occupiedSeats) * 100 : 0;
  
  const premiumSeats = passengers.filter(p => p.premiumUpgrade || p.seatPreferences?.type === 'premium').length;
  
  // Group seating statistics
  const groupSeatingMap = new Map<string, number>();
  passengers.forEach(p => {
    if (p.groupSeating?.groupId) {
      groupSeatingMap.set(p.groupSeating.groupId, (groupSeatingMap.get(p.groupSeating.groupId) || 0) + 1);
    }
  });
  const totalGroups = groupSeatingMap.size;
  const totalInGroups = Array.from(groupSeatingMap.values()).reduce((sum, count) => sum + count, 0);
  
  // Family seating statistics
  const familySeatingMap = new Map<string, { adults: number; children: number; infants: number }>();
  passengers.forEach(p => {
    if (p.familySeating?.familyId) {
      if (!familySeatingMap.has(p.familySeating.familyId)) {
        familySeatingMap.set(p.familySeating.familyId, {
          adults: p.familySeating.adults,
          children: p.familySeating.children,
          infants: p.familySeating.infants || 0
        });
      }
    }
  });
  const totalFamilies = familySeatingMap.size;
  const totalInFamilies = Array.from(familySeatingMap.values()).reduce((sum, family) => 
    sum + family.adults + family.children, 0
  );
  
  const specialRequirements = passengers.filter(p => p.wheelchair || p.infant).length;
  const withPreferences = passengers.filter(p => p.seatPreferences && p.seatPreferences.position && p.seatPreferences.position.length > 0).length;

  return (
    <Paper elevation={3} sx={{ p: { xs: 2, sm: 2.5 }, bgcolor: 'grey.50' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <EventSeatIcon color="primary" fontSize="large" />
        <Typography variant="h6" fontWeight="bold">
          Seat Arrangement Summary
        </Typography>
      </Box>

      {/* Overall Capacity */}
      <Card sx={{ mb: 2, bgcolor: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Overall Capacity
            </Typography>
            <Chip 
              label={`${occupancyRate.toFixed(0)}%`}
              color={occupancyRate > 80 ? 'error' : occupancyRate > 60 ? 'warning' : 'success'}
              size="small"
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={occupancyRate} 
            sx={{ height: 8, borderRadius: 1, mb: 1 }}
            color={occupancyRate > 80 ? 'error' : occupancyRate > 60 ? 'warning' : 'success'}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Typography variant="body2">
              <strong>{occupiedSeats}</strong> occupied
            </Typography>
            <Typography variant="body2">
              <strong>{availableSeats}</strong> available
            </Typography>
            <Typography variant="body2" color="text.secondary">
              of {totalSeats} seats
            </Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Check-in Status */}
      <Card sx={{ mb: 2, bgcolor: 'white' }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
            <Typography variant="subtitle2" color="text.secondary">
              Check-in Progress
            </Typography>
            <Chip 
              label={`${checkInRate.toFixed(0)}%`}
              color={checkInRate > 80 ? 'success' : checkInRate > 50 ? 'warning' : 'default'}
              size="small"
            />
          </Box>
          <LinearProgress 
            variant="determinate" 
            value={checkInRate} 
            sx={{ height: 8, borderRadius: 1, mb: 1 }}
            color={checkInRate > 80 ? 'success' : checkInRate > 50 ? 'warning' : 'inherit'}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <CheckCircleIcon fontSize="small" color="success" />
              <Typography variant="body2">
                <strong>{checkedInCount}</strong> checked in
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <PendingIcon fontSize="small" color="action" />
              <Typography variant="body2">
                <strong>{notCheckedInCount}</strong> pending
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* Seat Management Grid */}
      <Grid container spacing={1.5}>
        {/* Premium Seats */}
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: 'warning.50', height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <StarIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'warning.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="warning.dark">
                  {premiumSeats}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Premium Seats
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Groups */}
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: 'primary.50', height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <GroupIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'primary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="primary.dark">
                  {totalGroups}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Groups ({totalInGroups} pax)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Families */}
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: 'secondary.50', height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <FamilyRestroomIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'secondary.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="secondary.dark">
                  {totalFamilies}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Families ({totalInFamilies} pax)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Special Requirements */}
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card sx={{ bgcolor: 'info.50', height: '100%' }}>
            <CardContent sx={{ p: { xs: 1.5, sm: 2 }, '&:last-child': { pb: { xs: 1.5, sm: 2 } } }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
                <CheckCircleIcon sx={{ fontSize: { xs: 32, sm: 40 }, color: 'info.main', mb: 1 }} />
                <Typography variant="h4" fontWeight="bold" color="info.dark">
                  {specialRequirements}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Special Needs
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Info */}
      {withPreferences > 0 && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 1 }}>
            <Chip 
              label={`${withPreferences} passengers with preferences`}
              size="small"
              variant="outlined"
            />
            {totalGroups > 0 && (
              <Chip 
                label={`Largest group: ${Math.max(...Array.from(groupSeatingMap.values()))} passengers`}
                size="small"
                variant="outlined"
                color="primary"
              />
            )}
          </Box>
        </>
      )}
    </Paper>
  );
};

export default SeatArrangementSummary;
