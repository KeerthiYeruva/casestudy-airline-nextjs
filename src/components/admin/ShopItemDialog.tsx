"use client";

import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
  FormHelperText,
} from "@mui/material";
import { SHOP_CATEGORIES } from "@/constants/appConstants";
import { ShopItemDialogSchema, type ShopItemDialogFormData } from "@/lib/validationSchemas";

interface ShopItemDialogProps {
  open: boolean;
  onClose: () => void;
  editMode: boolean;
  shopItemForm: ShopItemDialogFormData;
  onSave: (form: ShopItemDialogFormData) => void;
}

const ShopItemDialog: React.FC<ShopItemDialogProps> = ({
  open,
  onClose,
  editMode,
  shopItemForm,
  onSave,
}) => {
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ShopItemDialogFormData, unknown, ShopItemDialogFormData>({
    resolver: zodResolver(ShopItemDialogSchema),
    defaultValues: shopItemForm,
    mode: "onBlur",
  });

  useEffect(() => {
    if (open) {
      reset(shopItemForm);
    }
  }, [open, reset, shopItemForm]);

  return (
    <Dialog open={open} onClose={onClose} component="form" onSubmit={handleSubmit(onSave)}>
      <DialogTitle>{editMode ? "Edit Shop Item" : "Add Shop Item"}</DialogTitle>
      <DialogContent>
        <Grid container spacing={2} sx={{ mt: 1 }}>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Item Name"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />
          </Grid>
          <Grid size={12}>
            <FormControl fullWidth error={!!errors.category}>
              <InputLabel>Category</InputLabel>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select {...field} label="Category">
                    {SHOP_CATEGORIES.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                )}
              />
              {errors.category && <FormHelperText>{errors.category.message}</FormHelperText>}
            </FormControl>
          </Grid>
          <Grid size={8}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              slotProps={{ htmlInput: { min: 0, step: 0.01 } }}
              {...register("price", { valueAsNumber: true })}
              error={!!errors.price}
              helperText={errors.price?.message}
            />
          </Grid>
          <Grid size={4}>
            <TextField
              fullWidth
              label="Currency"
              {...register("currency")}
              error={!!errors.currency}
              helperText={errors.currency?.message}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button type="submit" variant="contained">
          {editMode ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShopItemDialog;
