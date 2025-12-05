"use client";

import React from "react";
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
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { ShopItem } from "@/types";

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
              Add
            </Button>
          </Box>
          <List>
            {ancillaryServices.map((service) => (
              <ListItem
                key={service}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onEditService(service)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      size="small"
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
              Add
            </Button>
          </Box>
          <List>
            {mealOptions.map((meal) => (
              <ListItem
                key={meal}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onEditMeal(meal)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onDeleteMeal(meal)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </>
                }
              >
                <ListItemText primary={meal} />
              </ListItem>
            ))}
          </List>
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
              Add
            </Button>
          </Box>
          <List sx={{ maxHeight: 400, overflow: "auto" }}>
            {shopItems.map((item) => (
              <ListItem
                key={item.id}
                secondaryAction={
                  <>
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={() => onEditShopItem(item)}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      edge="end"
                      size="small"
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
        </Paper>
      </Grid>
    </Grid>
  );
};

export default ServicesMenuManagement;
