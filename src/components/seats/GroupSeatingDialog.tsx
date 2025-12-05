'use client';

/**
 * Group Seating Allocation Dialog
 * Allows staff to allocate seats for groups of passengers
 */

import React, { useState } from 'react';
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
import type { GroupSeating, Passenger } from '@/types';

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
  const [keepTogether, setKeepTogether] = useState(true);
  const [groupName, setGroupName] = useState('');

  // Reset state when dialog opens
  React.useEffect(() => {
    if (!open) return;
    setSelectedPassengers([]);
    setKeepTogether(true);
    setGroupName('');
  }, [open]);

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

  const handleAllocate = () => {
    if (selectedPassengers.length < 2) {
      return;
    }

    const groupId = `group_${Date.now()}`;
    const leadPassengerId = selectedPassengers[0];

    const groupSeating: GroupSeating = {
      groupId,
      size: selectedPassengers.length,
      keepTogether,
      leadPassengerId
    };

    onAllocate(groupSeating, selectedPassengers);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <GroupIcon />
          Allocate Group Seating
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 2 }}>
          <TextField
            label="Group Name (Optional)"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g., Corporate Group, Tour Group"
            fullWidth
          />

          <FormControlLabel
            control={
              <Switch
                checked={keepTogether}
                onChange={(e) => setKeepTogether(e.target.checked)}
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

          <Box>
            <Typography variant="subtitle1" gutterBottom fontWeight="bold">
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
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={handleAllocate}
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
