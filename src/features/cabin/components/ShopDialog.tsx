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
  useMediaQuery,
  useTheme,
} from "@mui/material";
import type { ShopItem } from "../../../domain/services/types";

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
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      fullScreen={isCompact}
      slotProps={{ paper: { sx: { m: { xs: 0, sm: 2 }, borderRadius: { xs: 0, sm: 2 } } } }}
    >
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

          <Box sx={{ maxHeight: { xs: "calc(100vh - 360px)", sm: 400 }, overflowY: "auto", pr: { sm: 0.5 } }}>
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
            <Box sx={{ mt: 3, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
              <Typography variant="subtitle1" gutterBottom>
                Selected: {selectedShopItem.name}
              </Typography>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1.5, mt: 2, flexWrap: "wrap" }}
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
                <Typography variant="h6" sx={{ ml: { sm: "auto" }, width: { xs: "100%", sm: "auto" } }}>
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
