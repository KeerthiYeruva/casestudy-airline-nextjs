"use client";

import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { SHOP_CATEGORIES } from "@/constants/appConstants";

interface ShopItemFormData {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
}

interface ShopItemDialogProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  shopItemForm: ShopItemFormData;
  onFormChange: (form: ShopItemFormData) => void;
  onSave: () => void;
}

const ShopItemDialog: React.FC<ShopItemDialogProps> = ({
  open,
  onClose,
  editMode,
  shopItemForm,
  onFormChange,
  onSave,
}) => {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{editMode ? "Edit Shop Item" : "Add Shop Item"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Item Name"
              value={shopItemForm.name}
              onChange={(e) =>
                onFormChange({ ...shopItemForm, name: e.target.value })
              }
            />
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={shopItemForm.category}
                label="Category"
                onChange={(e: SelectChangeEvent) =>
                  onFormChange({
                    ...shopItemForm,
                    category: e.target.value,
                  })
                }
              >
                {SHOP_CATEGORIES.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={8}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={shopItemForm.price}
              onChange={(e) =>
                onFormChange({
                  ...shopItemForm,
                  price: parseFloat(e.target.value),
                })
              }
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Currency"
              value={shopItemForm.currency}
              onChange={(e) =>
                onFormChange({ ...shopItemForm, currency: e.target.value })
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onSave} variant="contained">
          {editMode ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShopItemDialog;
