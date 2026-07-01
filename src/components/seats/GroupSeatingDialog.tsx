'use client';

/**
 * Group Seating Allocation Dialog
 * Allows staff to allocate seats for groups of passengers
 */

import React, { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControlLabel,
  Switch,
  Typography,
  Box,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
  Chip
} from '@mui/material';
import { Group as GroupIcon } from '@mui/icons-material';
import type { Passenger } from '@/types/passenger';
import type { GroupSeating } from '@/types/seat';
import { GroupSeatingDialogSchema, type GroupSeatingDialogFormData } from '@/lib/validationSchemas';

interface GroupSeatingDialogProps {
  open: boolean;
  onClose: () => void;
  onAllocate: (groupSeating: GroupSeating, passengerIds: string[]) => void;
  passengers: Passenger[];
  flightId: string;
}

const GroupSeatingDialog: React.FC<GroupSeatingDialogProps> = ({
  open,
  onClose,
  onAllocate,
  passengers,
  flightId
}) => {
  const [selectedPassengers, setSelectedPassengers] = useState<string[]>([]);
  const { control, handleSubmit, register, reset } = useForm<GroupSeatingDialogFormData>({
    resolver: zodResolver(GroupSeatingDialogSchema),
    defaultValues: {
      groupName: '',
      keepTogether: true,
    },
  });

  useEffect(() => {
    if (open) {
      reset({ groupName: '', keepTogether: true });
    }
  }, [open, reset]);

  const handleClose = () => {
    reset({ groupName: '', keepTogether: true });
    setSelectedPassengers([]);
    onClose();
  };

  const availablePassengers = passengers.filter(
    p => !p.groupSeating && p.flightId === flightId && !p.checkedIn
  );

  const handleTogglePassenger = (passengerId: string) => {
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

    const groupSeating: GroupSeating = {
      groupId,
      size: selectedPassengers.length,
      keepTogether: formData.keepTogether,
      leadPassengerId
    };

    onAllocate(groupSeating, selectedPassengers);
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
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleSubmit(handleAllocate)}
          variant="contained"
          color="primary"
          disabled={selectedPassengers.length < 2}
        >
          Allocate Group ({selectedPassengers.length} passengers)
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GroupSeatingDialog;
