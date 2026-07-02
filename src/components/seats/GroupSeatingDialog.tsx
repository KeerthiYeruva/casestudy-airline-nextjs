'use client';

/**
 * Group Seating Allocation Dialog
 * Allows staff to allocate seats for groups of passengers
 */

import React, { useEffect, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Alert,
  Paper,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip
} from '@mui/material';
import { Group as GroupIcon } from '@mui/icons-material';
import type { Passenger } from '../../types/passenger';
import type { GroupSeating } from '../../types/seat';
import { GroupSeatingDialogSchema, type GroupSeatingDialogFormData } from '../../lib/validationSchemas';

interface GroupSeatingDialogProps {
  open: boolean;
  onClose: () => void;
  onAllocate: (groupSeating: GroupSeating, passengerIds: string[], allocatedSeats: string[]) => void;
  passengers: Passenger[];
  flightId: string;
}

const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];

interface GroupSeatRecommendation {
  seats: string[];
  score: number;
  cohesion: number;
  confidence: 'High' | 'Medium' | 'Low';
  reasons: string[];
}

function getSeatRow(seat: string) {
  return Number.parseInt(seat.match(/^\d+/)?.[0] ?? '0', 10);
}

function getAvailableSeatsForRow(row: number, occupiedSeats: Set<string>) {
  return seatLetters
    .map((letter) => `${row}${letter}`)
    .filter((seat) => !occupiedSeats.has(seat));
}

function getConfidence(score: number): GroupSeatRecommendation['confidence'] {
  if (score >= 90) return 'High';
  if (score >= 70) return 'Medium';
  return 'Low';
}

function buildGroupRecommendation(seats: string[], keepTogether: boolean): GroupSeatRecommendation {
  const rows = Array.from(new Set(seats.map(getSeatRow))).filter((row) => row > 0);
  const rowSpan = rows.length > 0 ? Math.max(...rows) - Math.min(...rows) + 1 : 0;
  const sameRow = rows.length === 1;
  const adjacentRows = rowSpan <= 2;
  const cohesion = sameRow ? 100 : adjacentRows ? 92 : Math.max(45, 100 - (rowSpan - 1) * 12);
  let score = cohesion;
  const reasons = sameRow
    ? ['Group seated together in one row']
    : adjacentRows
      ? ['Group seated across adjacent rows']
      : ['Group seated in the closest available cabin section'];

  if (keepTogether && adjacentRows) {
    score += 4;
    reasons.push('Keep together preference satisfied');
  }

  const normalizedScore = Math.min(score, 100);

  return {
    seats,
    score: normalizedScore,
    cohesion,
    confidence: getConfidence(normalizedScore),
    reasons,
  };
}

function findGroupSeatRecommendation(seatsNeeded: number, keepTogether: boolean, occupiedSeats: Set<string>) {
  const recommendations: GroupSeatRecommendation[] = [];

  if (keepTogether) {
    for (let row = 1; row <= 10; row++) {
      const availableSeats = getAvailableSeatsForRow(row, occupiedSeats);
      if (availableSeats.length >= seatsNeeded) {
        recommendations.push(buildGroupRecommendation(availableSeats.slice(0, seatsNeeded), keepTogether));
      }
    }

    for (let startRow = 1; startRow <= 9; startRow++) {
      const availableSeats = [
        ...getAvailableSeatsForRow(startRow, occupiedSeats),
        ...getAvailableSeatsForRow(startRow + 1, occupiedSeats),
      ];

      if (availableSeats.length >= seatsNeeded) {
        recommendations.push(buildGroupRecommendation(availableSeats.slice(0, seatsNeeded), keepTogether));
      }
    }
  }

  const cabinSections = [
    [1, 2, 3],
    [4, 5, 6, 7],
    [8, 9, 10],
  ];

  for (const rows of cabinSections) {
    const availableSeats = rows.flatMap((row) => getAvailableSeatsForRow(row, occupiedSeats));
    if (availableSeats.length >= seatsNeeded) {
      recommendations.push(buildGroupRecommendation(availableSeats.slice(0, seatsNeeded), keepTogether));
    }
  }

  return recommendations.sort((a, b) => b.score - a.score)[0] ?? null;
}

const GroupSeatingDialog: React.FC<GroupSeatingDialogProps> = ({
  open,
  onClose,
  onAllocate,
  passengers,
  flightId
}) => {
  const [selectedPassengers, setSelectedPassengers] = useState<string[]>([]);
  const [allocationError, setAllocationError] = useState('');
  const { control, handleSubmit, register, reset } = useForm<GroupSeatingDialogFormData>({
    resolver: zodResolver(GroupSeatingDialogSchema),
    defaultValues: {
      groupName: '',
      keepTogether: true,
      priority: 'NORMAL',
    },
  });
  const keepTogether = useWatch({ control, name: 'keepTogether' }) ?? true;

  useEffect(() => {
    if (open) {
      reset({ groupName: '', keepTogether: true, priority: 'NORMAL' });
    }
  }, [open, reset]);

  const handleClose = () => {
    reset({ groupName: '', keepTogether: true, priority: 'NORMAL' });
    setSelectedPassengers([]);
    setAllocationError('');
    onClose();
  };

  const availablePassengers = passengers.filter(
    p => !p.groupSeating && p.flightId === flightId && !p.checkedIn
  );

  const groupRecommendation = React.useMemo(() => {
    if (selectedPassengers.length < 2) {
      return null;
    }

    const occupiedSeats = new Set(
      passengers
        .filter(passenger => passenger.seat && !selectedPassengers.includes(passenger.id))
        .map(passenger => passenger.seat)
    );

    return findGroupSeatRecommendation(selectedPassengers.length, keepTogether, occupiedSeats);
  }, [keepTogether, passengers, selectedPassengers]);

  const handleTogglePassenger = (passengerId: string) => {
    setAllocationError('');
    setSelectedPassengers(prev =>
      prev.includes(passengerId)
        ? prev.filter(id => id !== passengerId)
        : [...prev, passengerId]
    );
  };

  const handleAllocate = (formData: GroupSeatingDialogFormData) => {
    if (selectedPassengers.length < 2) {
      return;
    }

    const normalizedGroupName = formData.groupName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '_');
    const groupId = normalizedGroupName || `group_${selectedPassengers.join('_')}`;
    const leadPassengerId = selectedPassengers[0];
    const occupiedSeats = new Set(
      passengers
        .filter(passenger => passenger.seat && !selectedPassengers.includes(passenger.id))
        .map(passenger => passenger.seat)
    );
    const recommendation = findGroupSeatRecommendation(selectedPassengers.length, formData.keepTogether, occupiedSeats);
    const allocatedSeats = recommendation?.seats ?? [];

    if (allocatedSeats.length !== selectedPassengers.length) {
      setAllocationError('Unable to find enough nearby seats for this group. Try disabling keep together or free up seats first.');
      return;
    }
    const assignedRows = Array.from(new Set(allocatedSeats.map(getSeatRow))).filter(row => row > 0);

    const groupSeating: GroupSeating = {
      groupId,
      groupName: formData.groupName.trim() || undefined,
      size: selectedPassengers.length,
      keepTogether: formData.keepTogether,
      leadPassengerId,
      priority: formData.priority,
      assignedRows,
    };

    onAllocate(groupSeating, selectedPassengers, allocatedSeats);
    handleClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GroupIcon />
          Allocate Group Seating
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <TextField
            label="Group Name (Optional)"
            placeholder="e.g., Corporate Group, Tour Group"
            fullWidth
            {...register('groupName')}
          />

          <Controller
            name="priority"
            control={control}
            render={({ field }) => (
              <TextField {...field} select label="Priority" fullWidth>
                <MenuItem value="NORMAL">Normal</MenuItem>
                <MenuItem value="HIGH">High</MenuItem>
              </TextField>
            )}
          />

          <Controller
            name="keepTogether"
            control={control}
            render={({ field }) => (
              <FormControlLabel
                control={
                  <Switch
                    checked={field.value}
                    onChange={(event) => field.onChange(event.target.checked)}
                  />
                }
                label={
                  <Box>
                    <Typography variant="body1">Keep group together</Typography>
                    <Typography variant="caption" color="text.secondary">
                      Attempt to allocate all seats in the same row or adjacent rows
                    </Typography>
                  </Box>
                }
              />
            )}
          />

          <Box>
            <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 'bold' }}>
              Select Passengers for Group
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Choose at least 2 passengers to form a group
            </Typography>

            {selectedPassengers.length > 0 && (
              <Box sx={{ mb: 2 }}>
                <Typography variant="caption" color="text.secondary">
                  Selected: {selectedPassengers.length} passenger(s)
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
                  {selectedPassengers.map(id => {
                    const passenger = passengers.find(p => p.id === id);
                    return passenger ? (
                      <Chip
                        key={id}
                        label={passenger.name}
                        onDelete={() => handleTogglePassenger(id)}
                        color="primary"
                      />
                    ) : null;
                  })}
                </Box>
              </Box>
            )}

            {availablePassengers.length === 0 ? (
              <Alert severity="info">
                No passengers available for group allocation. Passengers must not be checked in or already in a group.
              </Alert>
            ) : (
              <List
                sx={{
                  maxHeight: 300,
                  overflow: 'auto',
                  border: '1px solid',
                  borderColor: 'divider',
                  borderRadius: 1
                }}
              >
                {availablePassengers.map(passenger => (
                  <ListItem key={passenger.id} disablePadding>
                    <ListItemButton
                      onClick={() => handleTogglePassenger(passenger.id)}
                      selected={selectedPassengers.includes(passenger.id)}
                    >
                      <ListItemText
                        primary={passenger.name}
                        secondary={`Seat: ${passenger.seat} • Booking: ${passenger.bookingReference}`}
                      />
                      {selectedPassengers.includes(passenger.id) && (
                        <Chip label="Selected" color="primary" size="small" />
                      )}
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>

          {selectedPassengers.length > 0 && selectedPassengers.length < 2 && (
            <Alert severity="warning">
              Please select at least 2 passengers to create a group
            </Alert>
          )}

          {allocationError && (
            <Alert severity="error">
              {allocationError}
            </Alert>
          )}

          {groupRecommendation && (
            <Paper elevation={0} sx={{ p: 2, border: '1px solid', borderColor: 'primary.main', bgcolor: 'primary.50' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 1, flexWrap: 'wrap', mb: 1 }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  Recommended Allocation
                </Typography>
                <Chip label={`${groupRecommendation.confidence} confidence`} color="primary" size="small" />
              </Box>
              <Typography variant="body2" sx={{ fontWeight: 'medium' }}>
                Seats: {groupRecommendation.seats.join(', ')}
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Group cohesion: {groupRecommendation.cohesion}% | Smart seating score: {groupRecommendation.score}%
              </Typography>
              <Box component="ul" sx={{ m: 0, pl: 2.5 }}>
                {groupRecommendation.reasons.map((reason) => (
                  <Typography key={reason} component="li" variant="caption" color="text.secondary">
                    {reason}
                  </Typography>
                ))}
              </Box>
            </Paper>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(handleAllocate)}
          variant="contained"
          color="primary"
          disabled={selectedPassengers.length < 2 || !groupRecommendation}
        >
          Apply Recommendation ({selectedPassengers.length} passengers)
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupSeatingDialog;
