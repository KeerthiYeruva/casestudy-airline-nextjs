"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface AddServiceDialogProps {
  open: boolean;
  availableServices: string[];
  selectedService: string;
  onServiceChange: (service: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const AddServiceDialog: React.FC<AddServiceDialogProps> = ({
  open,
  availableServices,
  selectedService,
  onServiceChange,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Ancillary Service</DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Service</InputLabel>
          <Select
            value={selectedService}
            label="Select Service"
            onChange={(e: SelectChangeEvent) => onServiceChange(e.target.value)}
          >
            {availableServices.map((service) => (
              <MenuItem key={service} value={service}>
                {service}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained">
          Add Service
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddServiceDialog;
