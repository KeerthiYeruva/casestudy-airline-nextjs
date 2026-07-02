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
  useMediaQuery,
  useTheme,
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
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      fullScreen={isCompact}
      slotProps={{ paper: { sx: { m: { xs: 0, sm: 2 }, borderRadius: { xs: 0, sm: 2 } } } }}
    >
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
