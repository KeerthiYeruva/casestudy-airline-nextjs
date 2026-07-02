'use client';

/**
 * Family Seating Allocation Dialog
 * Automatically allocates seats for families with children and infants
 */

import React, { useEffect, useMemo } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import type { Passenger } from '../../../domain/passengers/types';
import type { FamilySeating } from '../../../domain/seats/types';
import useToastStore from '../../../stores/useToastStore';
import { FamilySeatingDialogSchema, type FamilySeatingDialogFormData } from '../../../domain/validation/schemas';

interface FamilySeatingDialogProps {
  open: boolean;
  onClose: () => void;
  onAllocate: (familySeating: FamilySeating, passengerIds: string[], allocatedSeats: string[]) => void;
  passengers: Passenger[];
  flightId: string;
}

interface SeatingRecommendation {
  seats: string[];
  score: number;
  confidence: 'High' | 'Medium' | 'Low';
  reasons: string[];
}

const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

function getSeatRow(seat: string) {
  return Number.parseInt(seat.match(/^\d+/)?.[0] ?? '0', 10);
}

function getConfidence(score: number): SeatingRecommendation['confidence'] {
  if (score >= 90) return 'High';
  if (score >= 70) return 'Medium';
  return 'Low';
}

function getAvailableSeatsForRow(row: number, occupiedSeats: Set<string>) {
  return seatLetters
    .map((letter) => `${row}${letter}`)
    .filter((seat) => !occupiedSeats.has(seat));
}

function buildFamilyRecommendation(seats: string[], seatsNeeded: number, infants: number): SeatingRecommendation {
  const rows = Array.from(new Set(seats.map(getSeatRow))).filter((row) => row > 0);
  const sameRow = rows.length === 1;
  const adjacentRows = rows.length === 2 && Math.abs(rows[0] - rows[1]) === 1;
  let score = sameRow ? 100 : adjacentRows ? 82 : 55;
  const reasons = sameRow
    ? ['Family seated together in one row']
    : adjacentRows
      ? ['Family split across adjacent rows']
      : ['Family kept as close as available seats allow'];

  if (infants > 0 && rows.includes(1)) {
    score += 6;
    reasons.push('Bulkhead row prioritized for infant travel');
  }

  if (seats.length === seatsNeeded) {
    score += 4;
    reasons.push('Every seated family member has an assigned seat');
  }

  const normalizedScore = Math.min(score, 100);

  return {
    seats,
    score: normalizedScore,
    confidence: getConfidence(normalizedScore),
    reasons,
  };
}

function findFamilySeatRecommendation(seatsNeeded: number, infants: number, occupiedSeats: Set<string>) {
  const recommendations: SeatingRecommendation[] = [];

  for (let row = 1; row <= 10; row++) {
    for (let startIndex = 0; startIndex <= seatLetters.length - seatsNeeded; startIndex++) {
      const seats = seatLetters
        .slice(startIndex, startIndex + seatsNeeded)
        .map((letter) => `${row}${letter}`);

      if (seats.every((seat) => !occupiedSeats.has(seat))) {
        recommendations.push(buildFamilyRecommendation(seats, seatsNeeded, infants));
      }
    }
  }

  for (let startRow = 1; startRow <= 9; startRow++) {
    const seats = [
      ...getAvailableSeatsForRow(startRow, occupiedSeats),
      ...getAvailableSeatsForRow(startRow + 1, occupiedSeats),
    ].slice(0, seatsNeeded);

    if (seats.length === seatsNeeded) {
      recommendations.push(buildFamilyRecommendation(seats, seatsNeeded, infants));
    }
  }

  return recommendations.sort((a, b) => b.score - a.score)[0] ?? null;
}

const FamilySeatingDialog: React.FC<FamilySeatingDialogProps> = ({
  open,
  onClose,
  onAllocate,
  passengers,
  flightId
}) => {
  const defaultFormValues = useMemo(() => {
    const infantPassengers = passengers.filter(
      p => p.infant && p.flightId === flightId && !p.familySeating
    );
    const nonInfantPassengers = passengers.filter(
      p => !p.infant && p.flightId === flightId && !p.familySeating && !p.checkedIn
    );

    const detectedInfants = infantPassengers.length;
    const detectedAdults = Math.min(nonInfantPassengers.length, 2);
    const detectedChildren = Math.max(0, nonInfantPassengers.length - 2);

    return {
      adults: detectedAdults,
      children: detectedChildren,
      infants: detectedInfants,
      selectedPassengers: [
        ...infantPassengers.map(p => p.id),
        ...nonInfantPassengers.slice(0, detectedAdults + detectedChildren).map(p => p.id)
      ]
    };
  }, [flightId, passengers]);

  const { control, handleSubmit, reset, setValue } = useForm<FamilySeatingDialogFormData>({
    resolver: zodResolver(FamilySeatingDialogSchema),
    defaultValues: defaultFormValues,
  });

  useEffect(() => {
    if (open) {
      reset(defaultFormValues);
    }
  }, [defaultFormValues, open, reset]);

  const watchedForm = useWatch({ control });
  const adults = watchedForm.adults ?? defaultFormValues.adults;
  const children = watchedForm.children ?? defaultFormValues.children;
  const infants = watchedForm.infants ?? defaultFormValues.infants;
  const selectedPassengers = watchedForm.selectedPassengers ?? defaultFormValues.selectedPassengers;
  const { showToast } = useToastStore();

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

  const familyRecommendation = useMemo(() => {
    if (totalMembers < 2 || selectedPassengers.length !== totalMembers || !compositionValid || infants > adults) {
      return null;
    }

    const occupiedSeats = new Set(
      passengers
        .filter((passenger) => passenger.seat && !selectedPassengers.includes(passenger.id))
        .map((passenger) => passenger.seat)
    );

    return findFamilySeatRecommendation(seatsNeeded, infants, occupiedSeats);
  }, [adults, compositionValid, infants, passengers, seatsNeeded, selectedPassengers, totalMembers]);

  const handleTogglePassenger = (passengerId: string) => {
    const updatedPassengers = selectedPassengers.includes(passengerId)
      ? selectedPassengers.filter(id => id !== passengerId)
      : [...selectedPassengers, passengerId];

    setValue('selectedPassengers', updatedPassengers, { shouldDirty: true, shouldValidate: true });
  };

  const handleClose = () => {
    reset(defaultFormValues);
    onClose();
  };

  const handleAllocate = (formData: FamilySeatingDialogFormData) => {
    const { adults, children, infants, selectedPassengers } = formData;
    const totalMembers = adults + children + infants;
    const seatsNeeded = adults + children;

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

    const occupiedSeats = new Set(
      passengers
        .filter(p => p.seat && !selectedPassengers.includes(p.id))
        .map(p => p.seat)
    );

    const recommendation = findFamilySeatRecommendation(seatsNeeded, infants, occupiedSeats);
    const allocatedSeats = recommendation?.seats ?? [];

    if (allocatedSeats.length !== seatsNeeded) {
      showToast(`Unable to find ${seatsNeeded} consecutive seats for family seating. Please try manual seat selection.`, 'error');
      return;
    }

    const familyId = `family_${selectedPassengers.join('_')}`;

    const familySeating: FamilySeating = {
      familyId,
      adults,
      children,
      infants,
      autoAllocate: true
    };

    const orderedSeats = selectedPassengers.map((passengerId) => {
      const passenger = selectedPassengerObjects.find((selectedPassenger) => selectedPassenger.id === passengerId);
      if (!passenger) return allocatedSeats[0];

      if (passenger.infant) {
        const infantIndex = infantPassengers.findIndex((infantPassenger) => infantPassenger.id === passengerId);
        return allocatedSeats[Math.min(infantIndex, adults - 1)];
      }

      const seatIndex = nonInfantPassengers.findIndex((nonInfantPassenger) => nonInfantPassenger.id === passengerId);
      return allocatedSeats[seatIndex];
    });
    
    onAllocate(familySeating, selectedPassengers, orderedSeats);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
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
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Family Composition
            </Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid size={{ xs: 4 }}>
                <Controller
                  name="adults"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Adults"
                      type="number"
                      value={field.value}
                      onChange={(event) => field.onChange(Math.max(1, parseInt(event.target.value) || 1))}
                      slotProps={{ htmlInput: { min: 1, max: 10 } }}
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Controller
                  name="children"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Children"
                      type="number"
                      value={field.value}
                      onChange={(event) => field.onChange(Math.max(0, parseInt(event.target.value) || 0))}
                      slotProps={{ htmlInput: { min: 0, max: 10 } }}
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
              <Grid size={{ xs: 4 }}>
                <Controller
                  name="infants"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      label="Infants"
                      type="number"
                      value={field.value}
                      onChange={(event) => field.onChange(Math.max(0, parseInt(event.target.value) || 0))}
                      slotProps={{ htmlInput: { min: 0, max: 5 } }}
                      fullWidth
                      size="small"
                    />
                  )}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2, p: 2, bgcolor: 'primary.50', borderRadius: 1 }}>
              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                Total Family Members: {totalMembers}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                {adults} adult(s), {children} child(ren), {infants} infant(s)
              </Typography>
              <Typography variant="caption" color="primary.dark" sx={{ display: 'block', fontWeight: 'bold', mt: 0.5 }}>
                Seats needed: {seatsNeeded} (infants sit on adult&apos;s lap)
              </Typography>
            </Box>
          </Paper>

          <Paper elevation={0} sx={{ p: 2, bgcolor: 'background.default' }}>
            <Typography variant="subtitle2" gutterBottom sx={{ fontWeight: 'bold' }}>
              Select Family Members ({selectedPassengers.length}/{totalMembers})
            </Typography>
            <Typography variant="caption" color="text.secondary" gutterBottom sx={{ display: 'block' }}>
              Select passengers to include in this family seating
            </Typography>
            
            <Box sx={{ mt: 2, maxHeight: 300, overflowY: 'auto' }}>
              {availablePassengers.length === 0 ? (
                <Alert severity="warning">No available passengers for family seating</Alert>
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {availablePassengers.map((passenger, passengerIndex) => (
                    <Paper
                      key={`${passenger.id}-${passengerIndex}`}
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
                      onClick={() => handleTogglePassenger(passenger.id)}
                    >
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Checkbox
                          checked={selectedPassengers.includes(passenger.id)}
                          size="small"
                        />
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
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
              <Box component="ul" sx={{ my: 1, pl: 2.5 }}>
                <li>Expected: {infants} infant(s), {expectedNonInfants} adult(s)/child(ren)</li>
                <li>Selected: {selectedInfants} infant(s), {selectedNonInfants} adult(s)/child(ren)</li>
              </Box>
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
              <Typography variant="body2" sx={{ fontWeight: 'bold' }} gutterBottom>
                👶 Lap Infant Policy
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Infants under 2 years travel on an adult&apos;s lap and don&apos;t require their own seat. 
                The system will allocate {seatsNeeded} consecutive seats for your family of {totalMembers}.
              </Typography>
            </Alert>
          )}

          {familyRecommendation && (
            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'success.main', bgcolor: 'success.50' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Recommended Allocation
                </Typography>
                <Chip label={`${familyRecommendation.confidence} confidence`} color="success" size="small" />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                Seats: {familyRecommendation.seats.join(', ')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Smart seating score: {familyRecommendation.score}%
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {familyRecommendation.reasons.map((reason) => (
                  <Typography key={reason} component="li" variant="caption" color="text.secondary">
                    {reason}
                  </Typography>
                ))}
              </Box>
            </Paper>
          )}

          <Box sx={{ p: 2, bgcolor: 'info.50', borderRadius: 1 }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Note:</strong> Family seating will prioritize:
            </Typography>
            <Box component="ul" sx={{ my: 1, pl: 2.5 }}>
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
            </Box>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(handleAllocate)}
          variant="contained"
          color="primary"
          disabled={
            totalMembers < 2 || 
            selectedPassengers.length !== totalMembers || 
            availablePassengers.length < totalMembers ||
            !compositionValid ||
            infants > adults ||
            !familyRecommendation
          }
        >
          Apply Recommended Allocation
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FamilySeatingDialog;
