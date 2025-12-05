'use client';

import React, { useState, useEffect } from 'react';
import useCheckInStore from '@/stores/useCheckInStore';
import useDataStore from '@/stores/useDataStore';
import useToastStore from '@/stores/useToastStore';
import SeatMapVisual from './SeatMapVisual';
import FlightSelectionPanel from './checkin/FlightSelectionPanel';
import CheckInFilters from './checkin/CheckInFilters';
import PassengerListPanel from './checkin/PassengerListPanel';
import PassengerDetailsPanel from './checkin/PassengerDetailsPanel';
import ChangeSeatDialog from './checkin/ChangeSeatDialog';
import { Passenger } from '@/types';
import { Container, Paper, Typography, Grid, Box, Chip } from '@mui/material';
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

  const handleChangeSeat = async (newSeat: string) => {
    if (selectedPassenger) {
      const result = await changeSeat(selectedPassenger.id, newSeat);
      if (result) {
        showToast(`Seat changed to ${newSeat} for ${selectedPassenger.name}`, 'success');
        setChangeSeatDialog(false);
      } else {
        showToast('Seat change failed', 'error');
      }
    }
  };

  const handleChangeSeatClick = (passenger: Passenger) => {
    setSelectedPassenger(passenger);
    setChangeSeatDialog(true);
  };

  const handleFilterChange = (filterType: string, value: boolean | null) => {
    setFilter({ [filterType]: value });
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          Staff Check-In
        </Typography>
        {selectedFlight && (
          <Chip 
            label={`${selectedFlight.flightNumber}`} 
            color="primary" 
            sx={{ display: { xs: 'none', sm: 'inline-flex' } }}
          />
        )}
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {/* Flight Selection */}
        <Grid size={{ xs: 12, md: 3 }}>
          <FlightSelectionPanel
            flights={flights}
            selectedFlightId={selectedFlight?.id}
            onFlightSelect={handleFlightSelect}
          />
        </Grid>

        {/* Main Content */}
        <Grid size={{ xs: 12, md: 9 }}>
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
              <CheckInFilters
                checkedInFilter={filterOptions.checkedIn ?? null}
                wheelchairFilter={filterOptions.wheelchair ?? false}
                infantFilter={filterOptions.infant ?? false}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />

              <Grid container spacing={2}>
                {/* Seat Map */}
                <Grid size={{ xs: 12, lg: 7 }}>
                  <SeatMapVisual
                    passengers={flightPassengers}
                    onSeatClick={handleSeatClick}
                    mode="checkin"
                  />
                </Grid>

                {/* Passenger List */}
                <Grid size={{ xs: 12, lg: 5 }}>
                  <PassengerListPanel
                    passengers={filteredPassengers}
                    selectedPassengerId={selectedPassenger?.id}
                    onPassengerSelect={setSelectedPassenger}
                    onCheckIn={handleCheckIn}
                    onUndoCheckIn={handleUndoCheckIn}
                    onChangeSeat={handleChangeSeatClick}
                  />
                </Grid>
              </Grid>

              {/* Passenger Details */}
              {selectedPassenger && (
                <PassengerDetailsPanel passenger={selectedPassenger} />
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
      {selectedPassenger && (
        <ChangeSeatDialog
          open={changeSeatDialog}
          currentSeat={selectedPassenger.seat}
          passengerName={selectedPassenger.name}
          onClose={() => setChangeSeatDialog(false)}
          onConfirm={handleChangeSeat}
        />
      )}
    </Container>
  );
};

export default StaffCheckIn;
