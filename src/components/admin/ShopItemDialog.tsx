"use client";

import React, { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
  onSave: (form: ShopItemFormData) => void;
}

const shopItemDialogSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(1, "Item name is required"),
  category: z.string().min(1, "Category is required"),
  price: z.number().positive("Item price must be greater than 0"),
  currency: z.string().trim().min(1, "Currency is required"),
});

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
  } = useForm<ShopItemFormData, unknown, ShopItemFormData>({
    resolver: zodResolver(shopItemDialogSchema),
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
