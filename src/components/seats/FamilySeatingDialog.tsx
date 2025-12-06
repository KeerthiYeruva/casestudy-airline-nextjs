'use client';

/**
 * Family Seating Allocation Dialog
 * Automatically allocates seats for families with children and infants
 */

import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Alert,
  Grid,
  Paper,
  Checkbox,
  Chip
} from '@mui/material';
import { FamilyRestroom as FamilyIcon } from '@mui/icons-material';
import type { FamilySeating, Passenger } from '@/types';
import useToastStore from '@/stores/useToastStore';

interface FamilySeatingDialogProps {
  open: boolean;
  onClose: () => void;
  onAllocate: (familySeating: FamilySeating, passengerIds: string[], allocatedSeats: string[]) => void;
  passengers: Passenger[];
  flightId: string;
}

const FamilySeatingDialog: React.FC<FamilySeatingDialogProps> = ({
  open,
  onClose,
  onAllocate,
  passengers,
  flightId
}) => {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);
  const [selectedPassengers, setSelectedPassengers] = useState<string[]>([]);
  const { showToast } = useToastStore();

  React.useEffect(() => {
    if (!open) return;
    
    // Auto-detect family members from passengers with infant flag
    const infantPassengers = passengers.filter(
      p => p.infant && p.flightId === flightId && !p.familySeating
    );
    const nonInfantPassengers = passengers.filter(
      p => !p.infant && p.flightId === flightId && !p.familySeating && !p.checkedIn
    );

    const detectedInfants = infantPassengers.length;
    const detectedAdults = Math.min(nonInfantPassengers.length, 2);
    const detectedChildren = Math.max(0, nonInfantPassengers.length - 2);
    
    setInfants(detectedInfants);
    setAdults(detectedAdults);
    setChildren(detectedChildren);
    
    // Auto-select all available passengers by default
    const autoSelected = [
      ...infantPassengers.map(p => p.id),
      ...nonInfantPassengers.slice(0, detectedAdults + detectedChildren).map(p => p.id)
    ];
    setSelectedPassengers(autoSelected);
  }, [open, passengers, flightId]);

  const totalMembers = adults + children + infants;
  // Infants sit on adult's lap, so they don't need their own seat
  const seatsNeeded = adults + children;
  const availablePassengers = passengers.filter(
    p => !p.familySeating && p.flightId === flightId && !p.checkedIn
  );

  // Validate selected passengers match the family composition
  const selectedPassengerObjects = passengers.filter(p => selectedPassengers.includes(p.id));
  const selectedInfants = selectedPassengerObjects.filter(p => p.infant).length;
  const selectedNonInfants = selectedPassengerObjects.filter(p => !p.infant).length;
  const expectedNonInfants = adults + children;
  
  const compositionValid = selectedInfants === infants && selectedNonInfants === expectedNonInfants;

  const handleAllocate = () => {
    if (totalMembers < 2) {
      return;
    }

    if (selectedPassengers.length !== totalMembers) {
      return;
    }

    // Validate family composition
    const selectedPassengerObjects = passengers.filter(p => selectedPassengers.includes(p.id));
    const nonInfantPassengers = selectedPassengerObjects.filter(p => !p.infant);
    const infantPassengers = selectedPassengerObjects.filter(p => p.infant);
    
    if (infantPassengers.length !== infants) {
      showToast(`You specified ${infants} infant(s) but selected ${infantPassengers.length} infant passenger(s). Please adjust your selection.`, 'warning');
      return;
    }
    
    if (nonInfantPassengers.length !== seatsNeeded) {
      showToast(`You specified ${adults} adult(s) + ${children} child(ren) = ${seatsNeeded} seats needed, but selected ${nonInfantPassengers.length} non-infant passengers. Please adjust your selection.`, 'warning');
      return;
    }
    
    if (infants > adults) {
      showToast(`You cannot have more infants (${infants}) than adults (${adults}). Each infant must sit on an adult&apos;s lap.`, 'error');
      return;
    }

    // Find consecutive seats in the same row (e.g., 5A, 5B, 5C)
    const occupiedSeats = new Set(
      passengers
        .filter(p => p.seat && !selectedPassengers.includes(p.id))
        .map(p => p.seat)
    );

    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    let allocatedSeats: string[] = [];
    let foundRow = false;

    // Try to find a row with enough consecutive available seats (only for adults + children)
    for (let row = 1; row <= 10 && !foundRow; row++) {
      // Check for consecutive seats starting from each position
      for (let startIdx = 0; startIdx <= seatLetters.length - seatsNeeded && !foundRow; startIdx++) {
        const consecutiveSeats = [];
        let allAvailable = true;
        
        for (let i = 0; i < seatsNeeded; i++) {
          const seat = `${row}${seatLetters[startIdx + i]}`;
          if (occupiedSeats.has(seat)) {
            allAvailable = false;
            break;
          }
          consecutiveSeats.push(seat);
        }
        
        if (allAvailable && consecutiveSeats.length === seatsNeeded) {
          allocatedSeats = consecutiveSeats;
          foundRow = true;
        }
      }
    }

    // If can't fit in one row, try to find consecutive rows as fallback
    if (!foundRow) {
      for (let startRow = 1; startRow <= 9 && !foundRow; startRow++) {
        const row1Seats = seatLetters.map(letter => `${startRow}${letter}`);
        const row2Seats = seatLetters.map(letter => `${startRow + 1}${letter}`);
        
        const available1 = row1Seats.filter(seat => !occupiedSeats.has(seat));
        const available2 = row2Seats.filter(seat => !occupiedSeats.has(seat));
        
        if (available1.length + available2.length >= seatsNeeded) {
          allocatedSeats = [...available1, ...available2].slice(0, seatsNeeded);
          foundRow = true;
        }
      }
    }

    if (allocatedSeats.length !== seatsNeeded) {
      showToast(`Unable to find ${seatsNeeded} consecutive seats for family seating. Please try manual seat selection.`, 'error');
      return;
    }

    const familyId = `family_${Date.now()}`;

    const familySeating: FamilySeating = {
      familyId,
      adults,
      children,
      infants,
      autoAllocate: true
    };

    // Assign seats: adults and children get seats, infants share with adults (same seat number)
    const seatAssignments: string[] = [];
    
    // First, assign seats to non-infant passengers (adults + children)
    for (let i = 0; i < nonInfantPassengers.length; i++) {
      seatAssignments.push(allocatedSeats[i]);
    }
    
    // Infants share seats with adults (assign first adult's seat to each infant)
    for (let i = 0; i < infantPassengers.length; i++) {
      // Assign infant to same seat as an adult (lap infant)
      const adultSeatIndex = Math.min(i, adults - 1); // Distribute infants among adults
      seatAssignments.push(allocatedSeats[adultSeatIndex]);
    }

    // Pass both familySeating metadata and actual seat assignments (in correct passenger order)
    const orderedSeats = selectedPassengers.map((passengerId, index) => {
      const passenger = selectedPassengerObjects[index];
      const seatIndex = passenger.infant 
        ? nonInfantPassengers.length + infantPassengers.findIndex(p => p.id === passengerId)
        : nonInfantPassengers.findIndex(p => p.id === passengerId);
      return seatAssignments[seatIndex];
    });
    
    onAllocate(familySeating, selectedPassengers, orderedSeats);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <FamilyIcon />
          Family Seating Allocation
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <Alert severity="info">
            Family seating automatically allocates seats to keep family members together, 
            ensuring parents are seated near children and infants.
          </Alert>

          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
              Family Composition
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 4 }}>
                <TextField
                  label="Adults"
                  type="number"
                  value={adults}
                  onChange={(e) => setAdults(Math.max(1, parseInt(e.target.value) || 1))}
                  inputProps={{ min: 1, max: 10 }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField
                  label="Children"
                  type="number"
                  value={children}
                  onChange={(e) => setChildren(Math.max(0, parseInt(e.target.value) || 0))}
                  inputProps={{ min: 0, max: 10 }}
                  fullWidth
                  size="small"
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <TextField
                  label="Infants"
                  type="number"
                  value={infants}
                  onChange={(e) => setInfants(Math.max(0, parseInt(e.target.value) || 0))}
                  inputProps={{ min: 0, max: 5 }}
                  fullWidth
                  size="small"
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
              <Typography variant="body2" fontWeight="bold">
                Total Family Members: {totalMembers}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                {adults} adult(s), {children} child(ren), {infants} infant(s)
              </Typography>
              <Typography variant="caption" color="primary.dark" fontWeight="bold" display="block" sx={{ mt: 0.5 }}>
                Seats needed: {seatsNeeded} (infants sit on adult&apos;s lap)
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="subtitle2" gutterBottom fontWeight="bold">
              Select Family Members ({selectedPassengers.length}/{totalMembers})
            </Typography>
            <Typography variant="caption" color="text.secondary" gutterBottom display="block">
              Select passengers to include in this family seating
            </Typography>
            
            <Box sx={{ mt: 2, maxHeight: 300, overflowY: 'auto' }}>
              {availablePassengers.length === 0 ? (
                <Alert severity="warning">No available passengers for family seating</Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {availablePassengers.map((passenger) => (
                    <Paper
                      key={passenger.id}
                      elevation={selectedPassengers.includes(passenger.id) ? 3 : 0}
                      sx={{
                        p: 1.5,
                        border: '2px solid',
                        borderColor: selectedPassengers.includes(passenger.id) ? 'secondary.main' : 'divider',
                        bgcolor: selectedPassengers.includes(passenger.id) ? 'secondary.50' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s',
                        '&:hover': {
                          borderColor: 'secondary.main',
                          bgcolor: 'secondary.50',
                        }
                      }}
                      onClick={() => {
                        setSelectedPassengers(prev => 
                          prev.includes(passenger.id)
                            ? prev.filter(id => id !== passenger.id)
                            : [...prev, passenger.id]
                        );
                      }}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                          checked={selectedPassengers.includes(passenger.id)}
                          size="small"
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" fontWeight="medium">
                            {passenger.name}
                          </Typography>
                          <Box sx={{ display: 'flex', gap: 0.5, mt: 0.5 }}>
                            <Chip label={passenger.seat} size="small" variant="outlined" />
                            {passenger.infant && (
                              <Chip label="Infant" size="small" color="info" />
                            )}
                            {passenger.wheelchair && (
                              <Chip label="Wheelchair" size="small" color="warning" />
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </Box>
          </Paper>

          {selectedPassengers.length !== totalMembers && (
            <Alert severity="warning">
              Please select exactly {totalMembers} passengers ({selectedPassengers.length} currently selected)
            </Alert>
          )}

          {selectedPassengers.length === totalMembers && !compositionValid && (
            <Alert severity="error">
              Selected passengers don&apos;t match family composition:
              <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
                <li>Expected: {infants} infant(s), {expectedNonInfants} adult(s)/child(ren)</li>
                <li>Selected: {selectedInfants} infant(s), {selectedNonInfants} adult(s)/child(ren)</li>
              </ul>
              Please select passengers with the correct infant flags.
            </Alert>
          )}

          {infants > adults && (
            <Alert severity="error">
              Invalid: You cannot have more infants ({infants}) than adults ({adults}). 
              Each infant needs an adult&apos;s lap!
            </Alert>
          )}

          {availablePassengers.length < totalMembers && (
            <Alert severity="error">
              Not enough available passengers ({availablePassengers.length}) for the specified family size ({totalMembers}).
            </Alert>
          )}

          {infants > 0 && (
            <Alert severity="info" icon={false}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                👶 Lap Infant Policy
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Infants under 2 years travel on an adult&apos;s lap and don&apos;t require their own seat. 
                The system will allocate {seatsNeeded} consecutive seats for your family of {totalMembers}.
              </Typography>
            </Alert>
          )}

          <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Note:</strong> Family seating will prioritize:
            </Typography>
            <ul style={{ margin: '8px 0', paddingLeft: '20px' }}>
              <li>
                <Typography variant="caption" color="text.secondary">
                  Seats in the same row or adjacent rows
                </Typography>
              </li>
              <li>
                <Typography variant="caption" color="text.secondary">
                  Bulkhead seats for families with infants
                </Typography>
              </li>
              <li>
                <Typography variant="caption" color="text.secondary">
                  At least one adult next to each child under 12
                </Typography>
              </li>
            </ul>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleAllocate}
          variant="contained"
          color="primary"
          disabled={
            totalMembers < 2 || 
            selectedPassengers.length !== totalMembers || 
            availablePassengers.length < totalMembers ||
            !compositionValid ||
            infants > adults
          }
        >
          Allocate Family Seating
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FamilySeatingDialog;
