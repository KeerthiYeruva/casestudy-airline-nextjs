'use client';

import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectFlight,
  setFilter,
  clearFilters,
} from '../slices/checkInSlice';
import {
  checkInPassenger,
  undoCheckIn,
  changeSeat,
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
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import '../styles/StaffCheckIn.scss';

const StaffCheckIn = () => {
  const dispatch = useDispatch();
  const { flights, passengers } = useSelector((state) => state.data);
  const { selectedFlight, filterOptions } = useSelector((state) => state.checkIn);

  const [selectedPassenger, setSelectedPassenger] = useState(null);
  const [changeSeatDialog, setChangeSeatDialog] = useState(false);
  const [newSeatNumber, setNewSeatNumber] = useState('');

  // Filter flights based on current time (simplified - showing all for demo)
  const currentFlights = flights;

  // Get passengers for selected flight
  const flightPassengers = selectedFlight
    ? passengers.filter((p) => p.flightId === selectedFlight.id)
    : [];

  // Apply filters
  const filteredPassengers = flightPassengers.filter((passenger) => {
    if (filterOptions.checkedIn !== null && passenger.checkedIn !== filterOptions.checkedIn) {
      return false;
    }
    if (filterOptions.wheelchair && !passenger.wheelchair) {
      return false;
    }
    if (filterOptions.infant && !passenger.infant) {
      return false;
    }
    return true;
  });

  const handleFlightSelect = (flight) => {
    dispatch(selectFlight(flight));
    setSelectedPassenger(null);
  };

  const handleCheckIn = (passengerId) => {
    const passenger = passengers.find(p => p.id === passengerId);
    dispatch(checkInPassenger(passengerId));
    dispatch(showToast({ message: `${passenger?.name || 'Passenger'} checked in successfully`, severity: 'success' }));
  };

  const handleUndoCheckIn = (passengerId) => {
    const passenger = passengers.find(p => p.id === passengerId);
    dispatch(undoCheckIn(passengerId));
    dispatch(showToast({ message: `Check-in cancelled for ${passenger?.name || 'passenger'}`, severity: 'info' }));
  };

  const handleSeatClick = (seat) => {
    const passenger = flightPassengers.find((p) => p.seat === seat);
    if (passenger) {
      setSelectedPassenger(passenger);
    }
  };

  const handleChangeSeat = () => {
    if (!newSeatNumber || !newSeatNumber.trim()) {
      dispatch(showToast({ message: 'Please enter a valid seat number', severity: 'error' }));
      return;
    }
    if (selectedPassenger && newSeatNumber) {
      dispatch(changeSeat({ passengerId: selectedPassenger.id, newSeat: newSeatNumber.trim() }));
      dispatch(showToast({ message: `Seat changed to ${newSeatNumber.trim()} for ${selectedPassenger.name}`, severity: 'success' }));
      setChangeSeatDialog(false);
      setNewSeatNumber('');
    }
  };

  const handleFilterChange = (filterType, value) => {
    dispatch(setFilter({ [filterType]: value }));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  return (
    <Container maxWidth="xl" className="staff-checkin">
      <Typography variant="h4" gutterBottom>
        Staff Check-In
      </Typography>

      <Grid container spacing={3}>
        {/* Flight Selection */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} className="flight-list-panel">
            <Typography variant="h6" gutterBottom>
              Select Flight
            </Typography>
            <List>
              {currentFlights.map((flight) => (
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

              {/* Filters */}
              <Paper elevation={3} className="filters-panel" sx={{ mb: 2, p: 2 }}>
                <Typography variant="h6" gutterBottom>
                  Filters
                </Typography>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} sm={4}>
                    <FormControl fullWidth size="small">
                      <InputLabel>Check-In Status</InputLabel>
                      <Select
                        value={
                          filterOptions.checkedIn === null
                            ? 'all'
                            : filterOptions.checkedIn
                            ? 'checked'
                            : 'not-checked'
                        }
                        label="Check-In Status"
                        onChange={(e) => {
                          const value =
                            e.target.value === 'all'
                              ? null
                              : e.target.value === 'checked';
                          handleFilterChange('checkedIn', value);
                        }}
                      >
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="checked">Checked In</MenuItem>
                        <MenuItem value="not-checked">Not Checked In</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <FormGroup row>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={filterOptions.wheelchair}
                            onChange={(e) =>
                              handleFilterChange('wheelchair', e.target.checked)
                            }
                          />
                        }
                        label="Wheelchair"
                      />
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={filterOptions.infant}
                            onChange={(e) =>
                              handleFilterChange('infant', e.target.checked)
                            }
                          />
                        }
                        label="Infant"
                      />
                    </FormGroup>
                  </Grid>
                  <Grid item xs={12} sm={2}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={handleClearFilters}
                      fullWidth
                    >
                      Clear
                    </Button>
                  </Grid>
                </Grid>
              </Paper>

              <Grid container spacing={2}>
                {/* Seat Map */}
                <Grid item xs={12} lg={7}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <SeatMapVisual
                      passengers={flightPassengers}
                      onSeatClick={handleSeatClick}
                      mode="checkin"
                    />
                  </Paper>
                </Grid>

                {/* Passenger List */}
                <Grid item xs={12} lg={5}>
                  <Paper elevation={3} className="passenger-list-panel" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Passengers ({filteredPassengers.length})
                    </Typography>
                    <List>
                      {filteredPassengers.map((passenger) => (
                        <ListItem
                          key={passenger.id}
                          className={`passenger-item ${
                            selectedPassenger?.id === passenger.id ? 'selected' : ''
                          }`}
                          onClick={() => setSelectedPassenger(passenger)}
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
                            <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap', mb: 1 }}>
                              {passenger.wheelchair && (
                                <Chip label="Wheelchair" size="small" color="warning" />
                              )}
                              {passenger.infant && (
                                <Chip label="Infant" size="small" color="info" />
                              )}
                              {passenger.checkedIn && (
                                <Chip label="Checked In" size="small" color="success" />
                              )}
                            </Box>
                            <Typography variant="body2" color="textSecondary">
                              Services: {passenger.ancillaryServices.join(', ')}
                            </Typography>
                            <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                              <Button
                                variant="contained"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCheckIn(passenger.id);
                                }}
                                disabled={passenger.checkedIn}
                              >
                                Check In
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUndoCheckIn(passenger.id);
                                }}
                                disabled={!passenger.checkedIn}
                              >
                                Undo
                              </Button>
                              <Button
                                variant="outlined"
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedPassenger(passenger);
                                  setChangeSeatDialog(true);
                                }}
                              >
                                Change Seat
                              </Button>
                            </Box>
                          </Box>
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Grid>
              </Grid>

              {/* Passenger Details */}
              {selectedPassenger && (
                <Paper elevation={3} sx={{ mt: 2, p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Passenger Details
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Name
                      </Typography>
                      <Typography variant="body1">{selectedPassenger.name}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Seat
                      </Typography>
                      <Typography variant="body1">{selectedPassenger.seat}</Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Booking Reference
                      </Typography>
                      <Typography variant="body1">
                        {selectedPassenger.bookingReference}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <Typography variant="body2" color="textSecondary">
                        Status
                      </Typography>
                      <Typography variant="body1">
                        {selectedPassenger.checkedIn ? 'Checked In' : 'Not Checked In'}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="body2" color="textSecondary">
                        Ancillary Services
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        {selectedPassenger.ancillaryServices.map((service) => (
                          <Chip key={service} label={service} />
                        ))}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Special Requirements
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        {selectedPassenger.wheelchair && (
                          <Chip label="Wheelchair" color="warning" />
                        )}
                        {selectedPassenger.infant && (
                          <Chip label="Infant" color="info" />
                        )}
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Typography variant="body2" color="textSecondary">
                        Special Meal
                      </Typography>
                      <Typography variant="body1">
                        {selectedPassenger.specialMeal}
                      </Typography>
                    </Grid>
                  </Grid>
                </Paper>
              )}
            </>
          ) : (
            <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary">
                Please select a flight to begin check-in
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

      {/* Change Seat Dialog */}
      <Dialog open={changeSeatDialog} onClose={() => setChangeSeatDialog(false)}>
        <DialogTitle>Change Seat</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>
            Current seat: {selectedPassenger?.seat}
          </Typography>
          <TextField
            autoFocus
            margin="dense"
            label="New Seat Number"
            type="text"
            fullWidth
            variant="outlined"
            value={newSeatNumber}
            onChange={(e) => setNewSeatNumber(e.target.value.toUpperCase())}
            placeholder="e.g., 5A"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setChangeSeatDialog(false)}>Cancel</Button>
          <Button onClick={handleChangeSeat} variant="contained">
            Change Seat
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default StaffCheckIn;

