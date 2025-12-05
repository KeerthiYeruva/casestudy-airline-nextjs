"use client";

import React from "react";
import {
  Paper,
  Typography,
  Chip,
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  Grid,
  Avatar,
  Badge,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PersonIcon from '@mui/icons-material/Person';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import LocalMallIcon from '@mui/icons-material/LocalMall';
import AccessibleIcon from '@mui/icons-material/Accessible';
import ChildCareIcon from '@mui/icons-material/ChildCare';
import AirlineSeatReclineExtraIcon from '@mui/icons-material/AirlineSeatReclineExtra';
import { Passenger } from "@/types";

interface PassengerServicePanelProps {
  passenger: Passenger;
  onAddService: () => void;
  onRemoveService: (service: string) => void;
  onChangeMeal: () => void;
  onAddShopItem: () => void;
  onRemoveShopItem: (itemName: string) => void;
  onUpdateQuantity: (itemName: string, newQuantity: number) => void;
  calculateShopTotal: (shopRequests: Passenger["shopRequests"]) => number;
}

const PassengerServicePanel: React.FC<PassengerServicePanelProps> = ({
  passenger,
  onAddService,
  onRemoveService,
  onChangeMeal,
  onAddShopItem,
  onRemoveShopItem,
  onUpdateQuantity,
  calculateShopTotal,
}) => {
  return (
    <Paper elevation={3} sx={{ mt: 2, p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <Avatar sx={{ width: 56, height: 56, bgcolor: 'primary.main' }}>
          <PersonIcon fontSize="large" />
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5" fontWeight="bold">
            {passenger.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, mt: 0.5, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip 
              icon={<AirlineSeatReclineExtraIcon fontSize="small" />}
              label={`Seat ${passenger.seat}`} 
              size="small" 
              color="primary"
            />
            <Typography variant="caption" color="text.secondary">
              {passenger.bookingReference}
            </Typography>
          </Box>
        </Box>
      </Box>

      <Divider sx={{ mb: 3 }} />

      <Grid container spacing={2}>
        {/* Special Requirements */}
        {(passenger.wheelchair || passenger.infant) && (
          <Grid size={12}>
            <Card variant="outlined" sx={{ bgcolor: 'warning.50', borderColor: 'warning.main' }}>
              <CardContent sx={{ py: 1.5 }}>
                <Typography variant="subtitle2" color="warning.dark" gutterBottom fontWeight="medium">
                  Special Requirements
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  {passenger.wheelchair && (
                    <Chip 
                      label="Wheelchair Assistance" 
                      color="warning" 
                      size="small" 
                      icon={<AccessibleIcon />}
                    />
                  )}
                  {passenger.infant && (
                    <Chip 
                      label="Traveling with Infant" 
                      color="warning" 
                      size="small" 
                      icon={<ChildCareIcon />}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* Meal Preference */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <RestaurantIcon color="action" />
                  <Typography variant="h6" fontWeight="medium">Meal Preference</Typography>
                </Box>
                <Button variant="outlined" size="small" onClick={onChangeMeal}>
                  Change
                </Button>
              </Box>
              <Chip
                label={passenger.specialMeal || 'Regular'}
                color="secondary"
                sx={{ fontWeight: 'medium' }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Ancillary Services */}
        <Grid size={{ xs: 12, md: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Typography variant="h6" fontWeight="medium">
                  Ancillary Services
                </Typography>
                <Badge badgeContent={passenger.ancillaryServices?.length || 0} color="primary">
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={onAddService}
                  >
                    Add
                  </Button>
                </Badge>
              </Box>
              {passenger.ancillaryServices?.length > 0 ? (
                <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                  {passenger.ancillaryServices.map((service) => (
                    <Chip
                      key={service}
                      label={service}
                      onDelete={() => onRemoveService(service)}
                      deleteIcon={<DeleteIcon />}
                      color="primary"
                      variant="outlined"
                    />
                  ))}
                </Box>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No services added
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* In-Flight Shop Requests */}
        <Grid size={12}>
          <Card variant="outlined" sx={{ bgcolor: 'secondary.50' }}>
            <CardContent>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <LocalMallIcon color="secondary" />
                  <Typography variant="h6" fontWeight="medium">
                    In-Flight Shop
                  </Typography>
                  {passenger.shopRequests && passenger.shopRequests.length > 0 && (
                    <Chip 
                      label={`${passenger.shopRequests.length} items`}
                      size="small"
                      color="secondary"
                    />
                  )}
                </Box>
                <Button
                  variant="contained"
                  size="small"
                  startIcon={<AddIcon />}
                  onClick={onAddShopItem}
                  color="secondary"
                >
                  Add Item
                </Button>
              </Box>
              {passenger.shopRequests && passenger.shopRequests.length > 0 ? (
                <>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 1,
                    }}
                  >
                    {passenger.shopRequests.map((request, index) => (
                      <Box
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 1,
                          border: "1px solid #e0e0e0",
                          borderRadius: 1,
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="body1">
                            {request.itemName}
                          </Typography>
                          <Typography variant="body2" color="textSecondary">
                            ${request.price.toFixed(2)} each
                          </Typography>
                        </Box>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Button
                            size="small"
                            onClick={() =>
                              onUpdateQuantity(
                                request.itemName,
                                request.quantity - 1
                              )
                            }
                          >
                            -
                          </Button>
                          <Typography
                            variant="body1"
                            sx={{
                              minWidth: 30,
                              textAlign: "center",
                            }}
                          >
                            {request.quantity}
                          </Typography>
                          <Button
                            size="small"
                            onClick={() =>
                              onUpdateQuantity(
                                request.itemName,
                                request.quantity + 1
                              )
                            }
                          >
                            +
                          </Button>
                          <Typography
                            variant="body1"
                            sx={{
                              minWidth: 70,
                              textAlign: "right",
                              fontWeight: "bold",
                            }}
                          >
                            ${(request.price * request.quantity).toFixed(2)}
                          </Typography>
                          <Button
                            size="small"
                            color="error"
                            onClick={() => onRemoveShopItem(request.itemName)}
                          >
                            <DeleteIcon fontSize="small" />
                          </Button>
                        </Box>
                      </Box>
                    ))}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h6">Total:</Typography>
                    <Typography variant="h6" color="primary">
                      ${calculateShopTotal(passenger.shopRequests).toFixed(2)}
                    </Typography>
                  </Box>
                </>
              ) : (
                <Typography variant="body2" color="textSecondary">
                  No shop items requested
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PassengerServicePanel;
