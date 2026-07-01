"use client";

import React from "react";
import { Box, Dialog, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
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
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="lg"
      slotProps={{
        paper: {
          sx: {
            borderRadius: 2,
            maxHeight: { xs: "calc(100% - 32px)", sm: "calc(100% - 64px)" },
          },
        },
      }}
    >
      <DialogTitle sx={{ pb: 1.5 }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.25 }}>
            <AirlineSeatReclineExtraIcon color="primary" />
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Seat Map
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Read-only view for locating passengers, meals, and service requests.
              </Typography>
            </Box>
          </Box>
          <IconButton aria-label="Close seat map" onClick={onClose} size="small">
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers sx={{ bgcolor: "grey.50", p: { xs: 1.5, sm: 2.5 } }}>
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