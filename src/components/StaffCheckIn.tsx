'use client';

import React, { useState, useEffect } from 'react';
import useCheckInStore from '@/stores/useCheckInStore';
import useDataStore from '@/stores/useDataStore';
import useToastStore from '@/stores/useToastStore';
import SeatMapVisual from './SeatMapVisual';
import { Passenger } from '@/types';
import {
  Container,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemButton,
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
  SelectChangeEvent,
  Grid,
} from '@mui/material';
import '../styles/StaffCheckIn.scss';

const StaffCheckIn: React.FC = () => {
  const { flights, passengers, fetchFlights, fetchPassengers, checkInPassenger, undoCheckIn, changeSeat } = useDataStore();
  const { selectedFlight, filterOptions, selectFlight, setFilter, clearFilters } = useCheckInStore();
  const { showToast } = useToastStore();

  useEffect(() => {
    fetchFlights();
    fetchPassengers();
  }, [fetchFlights, fetchPassengers]);

  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
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

  const handleFlightSelect = (flight: typeof flights[0]) => {
    selectFlight(flight);
    setSelectedPassenger(null);
  };

  const handleCheckIn = async (passengerId: string) => {
    const passenger = passengers.find(p => p.id === passengerId);
    const result = await checkInPassenger(passengerId);
    if (result) {
      showToast(`${passenger?.name || 'Passenger'} checked in successfully`, 'success');
    } else {
      showToast('Check-in failed', 'error');
    }
  };

  const handleUndoCheckIn = async (passengerId: string) => {
    const passenger = passengers.find(p => p.id === passengerId);
    const result = await undoCheckIn(passengerId);
    if (result) {
      showToast(`Check-in cancelled for ${passenger?.name || 'passenger'}`, 'info');
    } else {
      showToast('Undo check-in failed', 'error');
    }
  };

  const handleSeatClick = (seat: string) => {
    const passenger = flightPassengers.find((p) => p.seat === seat);
    if (passenger) {
      setSelectedPassenger(passenger);
    }
  };

  const handleChangeSeat = async () => {
    if (!newSeatNumber || !newSeatNumber.trim()) {
      showToast('Please enter a valid seat number', 'error');
      return;
    }
    if (selectedPassenger && newSeatNumber) {
      const result = await changeSeat(selectedPassenger.id, newSeatNumber.trim());
      if (result) {
        showToast(`Seat changed to ${newSeatNumber.trim()} for ${selectedPassenger.name}`, 'success');
        setChangeSeatDialog(false);
        setNewSeatNumber('');
      } else {
        showToast('Seat change failed', 'error');
      }
    }
  };

  const handleFilterChange = (filterType: string, value: boolean | null) => {
    setFilter({ [filterType]: value });
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <Container maxWidth="xl" className="staff-checkin">
      <Typography variant="h4" gutterBottom>
        Staff Check-In
      </Typography>

      <Grid container spacing={3}>
        {/* Flight Selection */}
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper elevation={3} className="flight-list-panel">
            <Typography variant="h6" gutterBottom>
              Select Flight
            </Typography>
            <List>
              {currentFlights.map((flight) => (
                <ListItemButton
                  key={flight.id}
                  selected={selectedFlight?.id === flight.id}
                  onClick={() => handleFlightSelect(flight)}
                  className="flight-item"
                >
                  <ListItemText
                    primary={flight.name}
                    secondary={`${flight.time} | ${flight.from} → ${flight.to} | Gate: ${flight.gate}`}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>

        {/* Main Content */}
        <Grid size={{ xs: 12, md: 8 }}>
          {selectedFlight ? (
            <>
              {/* Flight Details */}
              <Paper elevation={3} className="flight-details" sx={{ mb: 2, p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  {selectedFlight.name}
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="textSecondary">
                      Time
                    </Typography>
                    <Typography variant="body1">{selectedFlight.time}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="textSecondary">
                      Route
                    </Typography>
                    <Typography variant="body1">
                      {selectedFlight.from} → {selectedFlight.to}
                    </Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="textSecondary">
                      Gate
                    </Typography>
                    <Typography variant="body1">{selectedFlight.gate}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
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
                  <Grid size={{ xs: 12, sm: 4 }}>
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
                        onChange={(e: SelectChangeEvent) => {
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
                  <Grid size={{ xs: 12, sm: 6 }}>
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
                  <Grid size={{ xs: 12, sm: 2 }}>
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
                <Grid size={{ xs: 12, lg: 7 }}>
                  <Paper elevation={3} sx={{ p: 2 }}>
                    <SeatMapVisual
                      passengers={flightPassengers}
                      onSeatClick={handleSeatClick}
                      mode="checkin"
                    />
                  </Paper>
                </Grid>

                {/* Passenger List */}
                <Grid size={{ xs: 12, lg: 5 }}>
                  <Paper elevation={3} className="passenger-list-panel" sx={{ p: 2 }}>
                    <Typography variant="h6" gutterBottom>
                      Passengers ({filteredPassengers.length})
                    </Typography>
                    <List>
                      {filteredPassengers.map((passenger) => (
                        <ListItem
                          key={passenger.id}
                          disablePadding
                        >
                          <ListItemButton
                            className={`passenger-item ${
                              selectedPassenger?.id === passenger.id ? 'selected' : ''
                            }`}
                            onClick={() => setSelectedPassenger(passenger)}
                            selected={selectedPassenger?.id === passenger.id}
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
                          </ListItemButton>
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
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        Name
                      </Typography>
                      <Typography variant="body1">{selectedPassenger.name}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        Seat
                      </Typography>
                      <Typography variant="body1">{selectedPassenger.seat}</Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        Booking Reference
                      </Typography>
                      <Typography variant="body1">
                        {selectedPassenger.bookingReference}
                      </Typography>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                      <Typography variant="body2" color="textSecondary">
                        Status
                      </Typography>
                      <Typography variant="body1">
                        {selectedPassenger.checkedIn ? 'Checked In' : 'Not Checked In'}
                      </Typography>
                    </Grid>
                    <Grid size={12}>
                      <Typography variant="body2" color="textSecondary">
                        Ancillary Services
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', mt: 1 }}>
                        {selectedPassenger.ancillaryServices.map((service) => (
                          <Chip key={service} label={service} />
                        ))}
                      </Box>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6 }}>
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
                    <Grid size={{ xs: 12, sm: 6 }}>
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
