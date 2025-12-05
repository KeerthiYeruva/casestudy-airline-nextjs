"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  CircularProgress,
} from "@mui/material";
import LockIcon from "@mui/icons-material/Lock";

interface ChangeSeatDialogProps {
  open: boolean;
  currentSeat: string;
  passengerName: string;
  onClose: () => void;
  onConfirm: (newSeat: string) => void;
  lockSeat?: (seatId: string) => Promise<boolean>;
  unlockSeat?: (seatId: string) => Promise<void>;
  isSeatLocked?: (seatId: string) => boolean;
}

const ChangeSeatDialog: React.FC<ChangeSeatDialogProps> = ({
  open,
  currentSeat,
  passengerName,
  onClose,
  onConfirm,
  lockSeat,
  unlockSeat,
  isSeatLocked,
}) => {
  const [newSeatNumber, setNewSeatNumber] = useState("");
  const [isLocking, setIsLocking] = useState(false);
  const [lockError, setLockError] = useState<string | null>(null);

  // Lock the new seat when user types it in
  useEffect(() => {
    if (!open || !newSeatNumber.trim() || !lockSeat) return;

    const seatId = newSeatNumber.trim().toUpperCase();
    const lockTimeout = setTimeout(async () => {
      if (isSeatLocked && isSeatLocked(seatId)) {
        setLockError(`Seat ${seatId} is currently being edited by another user`);
        return;
      }

      setIsLocking(true);
      setLockError(null);
      const locked = await lockSeat(seatId);
      setIsLocking(false);

      if (!locked) {
        setLockError(`Seat ${seatId} is currently being edited by another user`);
      }
    }, 500); // Debounce lock requests

    return () => clearTimeout(lockTimeout);
  }, [newSeatNumber, open, lockSeat, isSeatLocked]);

  // Cleanup: unlock seat on close
  useEffect(() => {
    if (!open && newSeatNumber.trim() && unlockSeat) {
      const seatId = newSeatNumber.trim().toUpperCase();
      unlockSeat(seatId);
    }
  }, [open, newSeatNumber, unlockSeat]);

  const handleConfirm = () => {
    if (newSeatNumber && newSeatNumber.trim() && !lockError) {
      const seatId = newSeatNumber.trim().toUpperCase();
      onConfirm(seatId);
      // Unlock will happen in cleanup
      setNewSeatNumber("");
      setLockError(null);
    }
  };

  const handleClose = () => {
    if (newSeatNumber.trim() && unlockSeat) {
      const seatId = newSeatNumber.trim().toUpperCase();
      unlockSeat(seatId);
    }
    setNewSeatNumber("");
    setLockError(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Seat</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Passenger: <strong>{passengerName}</strong>
        </Typography>
        <Typography gutterBottom sx={{ mb: 2 }}>
          Current seat: <strong>{currentSeat}</strong>
        </Typography>
        
        {lockError && (
          <Alert severity="warning" icon={<LockIcon />} sx={{ mb: 2 }}>
            {lockError}
          </Alert>
        )}
        
        <TextField
          autoFocus
          margin="dense"
          label="New Seat Number"
          type="text"
          fullWidth
          variant="outlined"
          value={newSeatNumber}
          onChange={(e) => setNewSeatNumber(e.target.value.toUpperCase())}
          placeholder="e.g., 5A"
          helperText="Format: Row number + Letter (e.g., 5A, 10F)"
          error={!!lockError}
          InputProps={{
            endAdornment: isLocking ? <CircularProgress size={20} /> : null,
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button 
          onClick={handleConfirm} 
          variant="contained" 
          disabled={!newSeatNumber.trim() || !!lockError || isLocking}
        >
          Change Seat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeSeatDialog;
