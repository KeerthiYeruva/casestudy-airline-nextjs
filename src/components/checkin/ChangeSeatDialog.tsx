"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
} from "@mui/material";

interface ChangeSeatDialogProps {
  open: boolean;
  currentSeat: string;
  passengerName: string;
  onClose: () => void;
  onConfirm: (newSeat: string) => void;
}

const ChangeSeatDialog: React.FC<ChangeSeatDialogProps> = ({
  open,
  currentSeat,
  passengerName,
  onClose,
  onConfirm,
}) => {
  const [newSeatNumber, setNewSeatNumber] = useState("");

  const handleConfirm = () => {
    if (newSeatNumber && newSeatNumber.trim()) {
      onConfirm(newSeatNumber.trim());
      setNewSeatNumber("");
    }
  };

  const handleClose = () => {
    setNewSeatNumber("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>Change Seat</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>
          Passenger: <strong>{passengerName}</strong>
        </Typography>
        <Typography gutterBottom>
          Current seat: <strong>{currentSeat}</strong>
        </Typography>
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
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleConfirm} variant="contained" disabled={!newSeatNumber.trim()}>
          Change Seat
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeSeatDialog;
