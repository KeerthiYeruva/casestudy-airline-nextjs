"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";

interface ChangeMealDialogProps {
  open: boolean;
  currentMeal: string;
  mealOptions: string[];
  selectedMeal: string;
  onMealChange: (meal: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const ChangeMealDialog: React.FC<ChangeMealDialogProps> = ({
  open,
  currentMeal,
  mealOptions,
  selectedMeal,
  onMealChange,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Change Meal Preference</DialogTitle>
      <DialogContent>
        <Typography variant="body2" color="textSecondary" gutterBottom>
          Current meal: {currentMeal}
        </Typography>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>Select Meal</InputLabel>
          <Select
            value={selectedMeal}
            label="Select Meal"
            onChange={(e: SelectChangeEvent) => onMealChange(e.target.value)}
          >
            {mealOptions.map((meal) => (
              <MenuItem key={meal} value={meal}>
                {meal}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} variant="contained">
          Change Meal
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChangeMealDialog;
