'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFlight } from '../slices/checkInSlice';
import {
  addAncillaryServiceToPassenger,
  removeAncillaryServiceFromPassenger,
  changeMealPreference,
  addShopRequest,
  removeShopRequest,
  updateShopRequestQuantity,
} from '../slices/dataSlice';
import { showToast } from '../slices/toastSlice';
import SeatMapVisual from './SeatMapVisual';
import {
  Container,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  Button,
  Chip,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import '../styles/InFlight.scss';

const InFlight = () => {
  const dispatch = useDispatch();
  const { flights, passengers, ancillaryServices, mealOptions, shopItems, shopCategories } =
    useSelector((state) => state.data);
  const { selectedFlight } = useSelector((state) => state.checkIn);

  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [addServiceDialog, setAddServiceDialog] = useState(false);
  const [changeMealDialog, setChangeMealDialog] = useState(false);
  const [shopDialog, setShopDialog] = useState(false);
  const [selectedService, setSelectedService] = useState('');
  const [selectedMeal, setSelectedMeal] = useState('');
  const [selectedShopItem, setSelectedShopItem] = useState(null);
  const [shopQuantity, setShopQuantity] = useState(1);
  const [shopCategory, setShopCategory] = useState('All');

  // Get passengers for selected flight
  const flightPassengers = selectedFlight
    ? passengers.filter((p) => p.flightId === selectedFlight.id)
    : [];

  const handleFlightSelect = (flight) => {
    dispatch(selectFlight(flight));
    setSelectedPassenger(null);
  };

  const handleSeatClick = (seat) => {
    const passenger = flightPassengers.find((p) => p.seat === seat);
    if (passenger) {
      setSelectedPassenger(passenger);
    }
  };

  const handleAddService = () => {
    if (!selectedPassenger) {
      dispatch(showToast({ message: 'Please select a passenger first', severity: 'warning' }));
      return;
    }
    if (!selectedService) {
      dispatch(showToast({ message: 'Please select a service', severity: 'warning' }));
      return;
    }
    dispatch(
      addAncillaryServiceToPassenger({
        passengerId: selectedPassenger.id,
        service: selectedService,
      })
    );
    dispatch(showToast({ message: `${selectedService} added for ${selectedPassenger.name}`, severity: 'success' }));
    setAddServiceDialog(false);
    setSelectedService('');
  };

  const handleRemoveService = (service) => {
    if (selectedPassenger) {
      dispatch(
        removeAncillaryServiceFromPassenger({
          passengerId: selectedPassenger.id,
          service: service,
        })
      );
      dispatch(showToast({ message: `${service} removed`, severity: 'info' }));
    }
  };

  const handleChangeMeal = () => {
    if (!selectedPassenger) {
      dispatch(showToast({ message: 'Please select a passenger first', severity: 'warning' }));
      return;
    }
    if (!selectedMeal) {
      dispatch(showToast({ message: 'Please select a meal option', severity: 'warning' }));
      return;
    }
    dispatch(
      changeMealPreference({
        passengerId: selectedPassenger.id,
        meal: selectedMeal,
      })
    );
    dispatch(showToast({ message: `Meal changed to ${selectedMeal} for ${selectedPassenger.name}`, severity: 'success' }));
    setChangeMealDialog(false);
    setSelectedMeal('');
  };

  const handleAddShopItem = () => {
    if (!selectedPassenger || !selectedShopItem) {
      dispatch(showToast({ message: 'Please select a passenger and shop item', severity: 'warning' }));
      return;
    }
    if (!shopQuantity || shopQuantity <= 0) {
      dispatch(showToast({ message: 'Quantity must be at least 1', severity: 'warning' }));
      return;
    }
    dispatch(
      addShopRequest({
        passengerId: selectedPassenger.id,
        item: selectedShopItem.name,
        quantity: shopQuantity,
        price: selectedShopItem.price,
      })
    );
    dispatch(showToast({ message: `${selectedShopItem.name} (x${shopQuantity}) added to cart`, severity: 'success' }));
    setShopDialog(false);
    setSelectedShopItem(null);
    setShopQuantity(1);
  };

  const handleRemoveShopItem = (item) => {
    if (selectedPassenger) {
      dispatch(
        removeShopRequest({
          passengerId: selectedPassenger.id,
          item: item,
        })
      );
      dispatch(showToast({ message: `${item} removed from cart`, severity: 'info' }));
    }
  };

  const handleUpdateQuantity = (item, newQuantity) => {
    if (selectedPassenger) {
      dispatch(
        updateShopRequestQuantity({
          passengerId: selectedPassenger.id,
          item: item,
          quantity: newQuantity,
        })
      );
    }
  };

  const filteredShopItems = shopCategory === 'All' 
    ? shopItems 
    : shopItems.filter(item => item.category === shopCategory);

  const calculateShopTotal = (shopRequests) => {
    if (!shopRequests || shopRequests.length === 0) return 0;
    return shopRequests.reduce((total, request) => {
      const price = Number(request.price) || 0;
      const quantity = Number(request.quantity) || 0;
      return total + (price * quantity);
    }, 0);
  };

  const renderSeatMap = () => {
    return (
      <SeatMapVisual
        passengers={flightPassengers}
        onSeatClick={handleSeatClick}
        mode="inflight"
      />
    );
  };

  return (
    <Container maxWidth="xl" className="inflight">
      <Typography variant="h4" gutterBottom>
        In-Flight Service
      </Typography>

      <Grid container spacing={3}>
        {/* Flight Selection */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} className="flight-list-panel">
            <Typography variant="h6" gutterBottom>
              Select Flight
            </Typography>
            <List>
              {flights.map((flight) => (
                <ListItem
                  key={flight.id}
                  button
                  selected={selectedFlight?.id === flight.id}
                  onClick={() => handleFlightSelect(flight)}
                  className="flight-item"
                >
                  <ListItemText
                    primary={flight.name}
                    secondary={`${flight.time} | ${flight.from} → ${flight.to} | Gate: ${flight.gate}`}
                  />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid item xs={12} md={8}>
          {selectedFlight ? (
            <>
              {/* Flight Details */}
              <Paper elevation={3} className="flight-details" sx={{ mb: 2, p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  {selectedFlight.name}
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Time
                    </Typography>
                    <Typography variant="body1">{selectedFlight.time}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Route
                    </Typography>
                    <Typography variant="body1">
                      {selectedFlight.from} → {selectedFlight.to}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Gate
                    </Typography>
                    <Typography variant="body1">{selectedFlight.gate}</Typography>
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <Typography variant="body2" color="textSecondary">
                      Status
                    </Typography>
                    <Typography variant="body1">{selectedFlight.status}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Grid container spacing={2}>
                {/* Seat Map */}
                <Grid item xs={12} lg={7}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    {renderSeatMap()}
                  </Paper>
                </Grid>

                {/* Passenger List */}
                <Grid item xs={12} lg={5}>
                  <Paper elevation={3} className="passenger-list-panel" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Passengers ({flightPassengers.length})
                    </Typography>
                    <List>
                      {flightPassengers.map((passenger) => (
                        <ListItem
                          key={passenger.id}
                          className={`passenger-item ${
                            selectedPassenger?.id === passenger.id ? 'selected' : ''
                          }`}
                          onClick={() => setSelectedPassenger(passenger)}
                          button
                        >
                          <Box sx={{ width: '100%' }}>
                            <Box
                              sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                mb: 1,
                              }}
                            >
                              <Typography variant="subtitle1">
                                {passenger.name}
                              </Typography>
                              <Chip
                                label={passenger.seat}
                                size="small"
                                color="primary"
                              />
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                              Meal: {passenger.specialMeal}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                              Services: {passenger.ancillaryServices.length}
                            </Typography>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>

              {/* Passenger Details and Service Management */}
              {selectedPassenger && (
                <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Passenger Details - {selectedPassenger.name}
                  </Typography>
                  <Divider sx={{ mb: 2 }} />

                  <Grid container spacing={3}>
                    {/* Basic Info */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            Basic Information
                          </Typography>
                          <Grid container spacing={1}>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="textSecondary">
                                Seat
                              </Typography>
                              <Typography variant="body1">
                                {selectedPassenger.seat}
                              </Typography>
                            </Grid>
                            <Grid item xs={6}>
                              <Typography variant="body2" color="textSecondary">
                                Booking Ref
                              </Typography>
                              <Typography variant="body1">
                                {selectedPassenger.bookingReference}
                              </Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <Typography variant="body2" color="textSecondary">
                                Special Requirements
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                {selectedPassenger.wheelchair && (
                                  <Chip label="Wheelchair" color="warning" size="small" />
                                )}
                                {selectedPassenger.infant && (
                                  <Chip label="Infant" color="info" size="small" />
                                )}
                                {!selectedPassenger.wheelchair &&
                                  !selectedPassenger.infant && (
                                    <Typography variant="body2">None</Typography>
                                  )}
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Meal Preference */}
                    <Grid item xs={12} md={6}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 1,
                            }}
                          >
                            <Typography variant="h6">Meal Preference</Typography>
                            <Button
                              variant="outlined"
                              size="small"
                              onClick={() => {
                                setSelectedMeal(selectedPassenger.specialMeal);
                                setChangeMealDialog(true);
                              }}
                            >
                              Change
                            </Button>
                          </Box>
                          <Chip
                            label={selectedPassenger.specialMeal}
                            color={
                              selectedPassenger.specialMeal === 'Regular'
                                ? 'default'
                                : 'secondary'
                            }
                          />
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* Ancillary Services */}
                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 2,
                            }}
                          >
                            <Typography variant="h6">Ancillary Services</Typography>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => setAddServiceDialog(true)}
                            >
                              Add Service
                            </Button>
                          </Box>
                          {selectedPassenger.ancillaryServices?.length > 0 ? (
                            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                              {selectedPassenger.ancillaryServices.map((service) => (
                                <Chip
                                  key={service}
                                  label={service}
                                  onDelete={() => handleRemoveService(service)}
                                  deleteIcon={<DeleteIcon />}
                                />
                              ))}
                            </Box>
                          ) : (
                            <Typography variant="body2" color="textSecondary">
                              No ancillary services requested
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>

                    {/* In-Flight Shop Requests */}
                    <Grid item xs={12}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              mb: 2,
                            }}
                          >
                            <Typography variant="h6">In-Flight Shop Requests</Typography>
                            <Button
                              variant="contained"
                              size="small"
                              startIcon={<AddIcon />}
                              onClick={() => setShopDialog(true)}
                              color="secondary"
                            >
                              Add Item
                            </Button>
                          </Box>
                          {selectedPassenger.shopRequests && selectedPassenger.shopRequests.length > 0 ? (
                            <>
                              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                                {selectedPassenger.shopRequests.map((request, index) => (
                                  <Box
                                    key={index}
                                    sx={{
                                      display: 'flex',
                                      justifyContent: 'space-between',
                                      alignItems: 'center',
                                      p: 1,
                                      border: '1px solid #e0e0e0',
                                      borderRadius: 1,
                                    }}
                                  >
                                    <Box sx={{ flex: 1 }}>
                                      <Typography variant="body1">{request.item}</Typography>
                                      <Typography variant="body2" color="textSecondary">
                                        ${request.price.toFixed(2)} each
                                      </Typography>
                                    </Box>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                      <Button
                                        size="small"
                                        onClick={() => handleUpdateQuantity(request.item, request.quantity - 1)}
                                      >
                                        -
                                      </Button>
                                      <Typography variant="body1" sx={{ minWidth: 30, textAlign: 'center' }}>
                                        {request.quantity}
                                      </Typography>
                                      <Button
                                        size="small"
                                        onClick={() => handleUpdateQuantity(request.item, request.quantity + 1)}
                                      >
                                        +
                                      </Button>
                                      <Typography variant="body1" sx={{ minWidth: 70, textAlign: 'right', fontWeight: 'bold' }}>
                                        ${(request.price * request.quantity).toFixed(2)}
                                      </Typography>
                                      <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleRemoveShopItem(request.item)}
                                      >
                                        <DeleteIcon fontSize="small" />
                                      </Button>
                                    </Box>
                                  </Box>
                                ))}
                              </Box>
                              <Divider sx={{ my: 2 }} />
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <Typography variant="h6">Total:</Typography>
                                <Typography variant="h6" color="primary">
                                  ${calculateShopTotal(selectedPassenger.shopRequests).toFixed(2)}
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
              )}
            </>
          ) : (
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                Please select a flight to view in-flight services
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Add Service Dialog */}
      <Dialog
        open={addServiceDialog}
        onClose={() => setAddServiceDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Add Ancillary Service</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Service</InputLabel>
            <Select
              value={selectedService}
              label="Select Service"
              onChange={(e) => setSelectedService(e.target.value)}
            >
              {ancillaryServices
                .filter(
                  (service) =>
                    !selectedPassenger?.ancillaryServices.includes(service)
                )
                .map((service) => (
                  <MenuItem key={service} value={service}>
                    {service}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAddServiceDialog(false)}>Cancel</Button>
          <Button onClick={handleAddService} variant="contained">
            Add Service
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Meal Dialog */}
      <Dialog
        open={changeMealDialog}
        onClose={() => setChangeMealDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Change Meal Preference</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Current meal: {selectedPassenger?.specialMeal}
          </Typography>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Select Meal</InputLabel>
            <Select
              value={selectedMeal}
              label="Select Meal"
              onChange={(e) => setSelectedMeal(e.target.value)}
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
          <Button onClick={() => setChangeMealDialog(false)}>Cancel</Button>
          <Button onClick={handleChangeMeal} variant="contained">
            Change Meal
          </Button>
        </DialogActions>
      </Dialog>

      {/* In-Flight Shop Dialog */}
      <Dialog
        open={shopDialog}
        onClose={() => {
          setShopDialog(false);
          setSelectedShopItem(null);
          setShopQuantity(1);
          setShopCategory('All');
        }}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>In-Flight Shop - Add Item</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Category</InputLabel>
              <Select
                value={shopCategory}
                label="Category"
                onChange={(e) => setShopCategory(e.target.value)}
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

            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              <Grid container spacing={2}>
                {filteredShopItems.map((item) => (
                  <Grid item xs={12} sm={6} key={item.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        cursor: 'pointer',
                        border: selectedShopItem?.id === item.id ? 2 : 1,
                        borderColor: selectedShopItem?.id === item.id ? 'primary.main' : 'divider',
                        '&:hover': {
                          boxShadow: 3,
                        },
                      }}
                      onClick={() => setSelectedShopItem(item)}
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
              <Box sx={{ mt: 3, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Selected: {selectedShopItem.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
                  <Typography variant="body1">Quantity:</Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setShopQuantity(Math.max(1, shopQuantity - 1))}
                  >
                    -
                  </Button>
                  <Typography variant="body1" sx={{ minWidth: 40, textAlign: 'center' }}>
                    {shopQuantity}
                  </Typography>
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => setShopQuantity(shopQuantity + 1)}
                  >
                    +
                  </Button>
                  <Typography variant="h6" sx={{ ml: 'auto' }}>
                    Total: ${(selectedShopItem.price * shopQuantity).toFixed(2)}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setShopDialog(false);
              setSelectedShopItem(null);
              setShopQuantity(1);
              setShopCategory('All');
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddShopItem}
            variant="contained"
            color="secondary"
            disabled={!selectedShopItem}
          >
            Add to Order
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default InFlight;

