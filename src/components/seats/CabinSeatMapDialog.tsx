"use client";

import React from "react";
import { Dialog, DialogContent, DialogTitle, Typography } from "@mui/material";
import SeatMapVisual from "@/components/seats/SeatMapVisual";
import type { Passenger } from "@/types/passenger";

interface CabinSeatMapDialogProps {
  open: boolean;
  passengers: Passenger[];
  onClose: () => void;
  onSeatSelect: (seat: string) => void;
}

const CabinSeatMapDialog: React.FC<CabinSeatMapDialogProps> = ({
  open,
  passengers,
  onClose,
  onSeatSelect,
}) => {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>Seat Map</DialogTitle>
      <DialogContent dividers>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Use this read-only view to locate passengers, meals, and service requests.
        </Typography>
        <SeatMapVisual
          passengers={passengers}
          onSeatClick={onSeatSelect}
          mode="inflight"
        />
      </DialogContent>
    </Dialog>
  );
};

export default CabinSeatMapDialog;