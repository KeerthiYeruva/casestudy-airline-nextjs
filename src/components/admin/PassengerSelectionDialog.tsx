"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  InputAdornment,
  Box,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { Passenger } from "@/types";

interface PassengerSelectionDialogProps {
  open: boolean;
  onClose: () => void;
  passengers: Passenger[];
  onSelect: (passengerId: string) => void;
  title: string;
  filterPredicate?: (passenger: Passenger) => boolean;
}

const PassengerSelectionDialog: React.FC<PassengerSelectionDialogProps> = ({
  open,
  onClose,
  passengers,
  onSelect,
  title,
  filterPredicate,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPassengers = passengers
    .filter(p => filterPredicate ? filterPredicate(p) : true)
    .filter(p => {
      if (!searchQuery) return true;
      const query = searchQuery.toLowerCase();
      return (
        p.name.toLowerCase().includes(query) ||
        p.seat.toLowerCase().includes(query) ||
        p.flightId.toLowerCase().includes(query)
      );
    });

  const handleSelect = (passengerId: string) => {
    onSelect(passengerId);
    setSearchQuery("");
    onClose();
  };

  const handleClose = () => {
    setSearchQuery("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          size="small"
          placeholder="Search by name, seat, or flight..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          sx={{ mb: 2 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
        
        {filteredPassengers.length > 0 ? (
          <List sx={{ maxHeight: 400, overflow: 'auto' }}>
            {filteredPassengers.map((passenger) => (
              <ListItemButton
                key={passenger.id}
                onClick={() => handleSelect(passenger.id)}
              >
                <ListItemText
                  primary={passenger.name}
                  secondary={`Seat ${passenger.seat} - Flight ${passenger.flightId}`}
                />
              </ListItemButton>
            ))}
          </List>
        ) : (
          <Box sx={{ py: 4, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {searchQuery ? 'No passengers match your search' : 'No passengers available'}
            </Typography>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PassengerSelectionDialog;
