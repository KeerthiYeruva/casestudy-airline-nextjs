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
  Box,
  Card,
  CardContent,
  Chip,
  SelectChangeEvent,
  Grid,
} from "@mui/material";
import { ShopItem } from "@/types";

interface ShopDialogProps {
  open: boolean;
  shopCategories: string[];
  shopCategory: string;
  filteredShopItems: ShopItem[];
  selectedShopItem: ShopItem | null;
  shopQuantity: number;
  onCategoryChange: (category: string) => void;
  onItemSelect: (item: ShopItem) => void;
  onQuantityChange: (quantity: number) => void;
  onClose: () => void;
  onConfirm: () => void;
}

const ShopDialog: React.FC<ShopDialogProps> = ({
  open,
  shopCategories,
  shopCategory,
  filteredShopItems,
  selectedShopItem,
  shopQuantity,
  onCategoryChange,
  onItemSelect,
  onQuantityChange,
  onClose,
  onConfirm,
}) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>In-Flight Shop - Add Item</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Category</InputLabel>
            <Select
              value={shopCategory}
              label="Category"
              onChange={(e: SelectChangeEvent) =>
                onCategoryChange(e.target.value)
              }
            >
              {shopCategories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <Typography variant="subtitle2" gutterBottom sx={{ mb: 2 }}>
            Select an item:
          </Typography>

          <Box sx={{ maxHeight: 400, overflowY: "auto" }}>
            <Grid container spacing={2}>
              {filteredShopItems.map((item) => (
                <Grid size={{ xs: 12, sm: 6 }} key={item.id}>
                  <Card
                    variant="outlined"
                    sx={{
                      cursor: "pointer",
                      border: selectedShopItem?.id === item.id ? 2 : 1,
                      borderColor:
                        selectedShopItem?.id === item.id
                          ? "primary.main"
                          : "divider",
                      "&:hover": {
                        boxShadow: 3,
                      },
                    }}
                    onClick={() => onItemSelect(item)}
                  >
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {item.name}
                      </Typography>
                      <Chip label={item.category} size="small" sx={{ mb: 1 }} />
                      <Typography variant="h6" color="primary">
                        ${item.price.toFixed(2)}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {selectedShopItem && (
            <Box sx={{ mt: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Selected: {selectedShopItem.name}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}
              >
                <Typography variant="body1">Quantity:</Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onQuantityChange(Math.max(1, shopQuantity - 1))}
                >
                  -
                </Button>
                <Typography
                  variant="body1"
                  sx={{ minWidth: 40, textAlign: "center" }}
                >
                  {shopQuantity}
                </Typography>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => onQuantityChange(shopQuantity + 1)}
                >
                  +
                </Button>
                <Typography variant="h6" sx={{ ml: "auto" }}>
                  Total: ${(selectedShopItem.price * shopQuantity).toFixed(2)}
                </Typography>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color="secondary"
          disabled={!selectedShopItem}
        >
          Add to Order
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShopDialog;
