"use client";

import React, { useState } from "react";
import {
  Grid,
  Paper,
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { ShopItem } from "../../../domain/services/types";

interface ServicesMenuManagementProps {
  ancillaryServices: string[];
  mealOptions: string[];
  shopItems: ShopItem[];
  onAddService: () => void;
  onEditService: (service: string) => void;
  onDeleteService: (service: string) => void;
  onAddMeal: () => void;
  onEditMeal: (meal: string) => void;
  onDeleteMeal: (meal: string) => void;
  onAddShopItem: () => void;
  onEditShopItem: (item: ShopItem) => void;
  onDeleteShopItem: (id: string) => void;
}

const ServicesMenuManagement: React.FC<ServicesMenuManagementProps> = ({
  ancillaryServices,
  mealOptions,
  shopItems,
  onAddService,
  onEditService,
  onDeleteService,
  onAddMeal,
  onEditMeal,
  onDeleteMeal,
  onAddShopItem,
  onEditShopItem,
  onDeleteShopItem,
}) => {
  const theme = useTheme();
  const isCompact = useMediaQuery(theme.breakpoints.down("md"));
  const [showAllServices, setShowAllServices] = useState(false);
  const [showAllMeals, setShowAllMeals] = useState(false);
  const [showAllShopItems, setShowAllShopItems] = useState(false);
  const protectedMealOptions = new Set(['Regular']);
  const previewCount = 4;
  const visibleServices = isCompact && !showAllServices ? ancillaryServices.slice(0, previewCount) : ancillaryServices;
  const visibleMeals = isCompact && !showAllMeals ? mealOptions.slice(0, previewCount) : mealOptions;
  const visibleShopItems = isCompact && !showAllShopItems ? shopItems.slice(0, previewCount) : shopItems;

  const renderShowToggle = (totalCount: number, visibleCount: number, expanded: boolean, onToggle: () => void) => {
    if (!isCompact || totalCount <= previewCount) return null;

    return (
      <Button size="small" variant="text" onClick={onToggle} sx={{ mt: 1 }}>
        {expanded ? "Show fewer" : `Show ${totalCount - visibleCount} more`}
      </Button>
    );
  };

  return (
    <Grid container spacing={3}>
      {/* Ancillary Services */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6">Ancillary Services</Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onAddService}
            >
              Add Service
            </Button>
          </Box>
          <List>
            {visibleServices.map((service, serviceIndex) => (
              <ListItem
                key={`${service}-${serviceIndex}`}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      size="small"
                      aria-label={`Edit ${service}`}
                      onClick={() => onEditService(service)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      size="small"
                      aria-label={`Delete ${service}`}
                      onClick={() => onDeleteService(service)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={service} />
              </ListItem>
            ))}
          </List>
          {renderShowToggle(ancillaryServices.length, visibleServices.length, showAllServices, () => setShowAllServices((showAll) => !showAll))}
        </Paper>
      </Grid>

      {/* Meal Options */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6">Meal Options</Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onAddMeal}
            >
              Add Meal
            </Button>
          </Box>
          <List>
            {visibleMeals.map((meal, mealIndex) => {
              const isProtectedMeal = protectedMealOptions.has(meal);

              return (
                <ListItem
                  key={`${meal}-${mealIndex}`}
                  secondaryAction={
                    isProtectedMeal ? (
                      <Typography variant="caption" color="text.secondary">
                        Default
                      </Typography>
                    ) : (
                      <>
                        <IconButton
                          edge="end"
                          size="small"
                          aria-label={`Edit ${meal}`}
                          onClick={() => onEditMeal(meal)}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          edge="end"
                          size="small"
                          aria-label={`Delete ${meal}`}
                          onClick={() => onDeleteMeal(meal)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </>
                    )
                  }
                >
                  <ListItemText primary={meal} />
                </ListItem>
              );
            })}
          </List>
          {renderShowToggle(mealOptions.length, visibleMeals.length, showAllMeals, () => setShowAllMeals((showAll) => !showAll))}
        </Paper>
      </Grid>

      {/* Shop Items */}
      <Grid size={{ xs: 12, md: 4 }}>
        <Paper variant="outlined" sx={{ p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mb: 2,
            }}
          >
            <Typography variant="h6">Shop Items ({shopItems.length})</Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<AddIcon />}
              onClick={onAddShopItem}
            >
              Add Shop Item
            </Button>
          </Box>
          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {visibleShopItems.map((item, itemIndex) => (
              <ListItem
                key={`${item.id}-${itemIndex}`}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      size="small"
                      aria-label={`Edit ${item.name}`}
                      onClick={() => onEditShopItem(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      size="small"
                      aria-label={`Delete ${item.name}`}
                      onClick={() => onDeleteShopItem(item.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText
                  primary={item.name}
                  secondary={`${item.category} - $${item.price}`}
                />
              </ListItem>
            ))}
          </List>
          {renderShowToggle(shopItems.length, visibleShopItems.length, showAllShopItems, () => setShowAllShopItems((showAll) => !showAll))}
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ServicesMenuManagement;
