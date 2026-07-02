'use client';

import React, { useState, useEffect, useRef } from 'react';
import useCheckInStore from '@/stores/useCheckInStore';
import useDataStore from '@/stores/useDataStore';
import useToastStore from '@/stores/useToastStore';
import useRealtimeUpdates from '@/hooks/useRealtimeUpdates';
import SeatMapVisual from '../seats/SeatMapVisual';
import FlightSelectionPanel from './FlightSelectionPanel';
import CheckInFilters from './CheckInFilters';
import PassengerListPanel from './PassengerListPanel';
import PassengerDetailsPanel from './PassengerDetailsPanel';
import ChangeSeatDialog from './ChangeSeatDialog';
import BoardingPassDialog from './BoardingPassDialog';
import SeatPreferencesDialog from '../seats/SeatPreferencesDialog';
import GroupSeatingDialog from '../seats/GroupSeatingDialog';
import FamilySeatingDialog from '../seats/FamilySeatingDialog';
import PremiumSeatUpsellDialog from '../seats/PremiumSeatUpsellDialog';
import SeatArrangementSummary from '../seats/SeatArrangementSummary';
import FlightInfoGrid from '../ui/FlightInfoGrid';
import PageHeader from '../ui/PageHeader';
import type { Passenger } from '@/types/passenger';
import { Container, Paper, Typography, Grid, Box, Button, Stack, Dialog, DialogTitle, DialogContent } from '@mui/material';
import GroupIcon from '@mui/icons-material/Group';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import '@/styles/StaffCheckIn.scss';

const StaffCheckIn: React.FC = () => {
  const { flights, passengers, fetchFlights, fetchPassengers, checkInPassenger, undoCheckIn, changeSeat, updatePassenger } = useDataStore();
  const { selectedFlight, filterOptions, selectFlight, setFilter, clearFilters } = useCheckInStore();
  const { showToast } = useToastStore();
  const { isConnected, isSeatLocked, lockSeat, unlockSeat } = useRealtimeUpdates();
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch once on initial mount if store is empty
    if (!hasFetchedRef.current) {
      if (flights.length === 0) {
        fetchFlights();
      }
      if (passengers.length === 0) {
        fetchPassengers();
      }
      hasFetchedRef.current = true;
    }
  }, [flights.length, passengers.length, fetchFlights, fetchPassengers]);

  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [passengerDetailsDialog, setPassengerDetailsDialog] = useState(false);
  const [changeSeatDialog, setChangeSeatDialog] = useState(false);
  const [seatPreferencesDialog, setSeatPreferencesDialog] = useState(false);
  const [groupSeatingDialog, setGroupSeatingDialog] = useState(false);
  const [familySeatingDialog, setFamilySeatingDialog] = useState(false);
  const [premiumSeatDialog, setPremiumSeatDialog] = useState(false);
  const [boardingPassDialog, setBoardingPassDialog] = useState(false);

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
      await fetchPassengers();
    } else {
      showToast('Check-in failed', 'error');
    }
  };

  const handleUndoCheckIn = async (passengerId: string) => {
    const passenger = passengers.find(p => p.id === passengerId);
    const result = await undoCheckIn(passengerId);
    if (result) {
      showToast(`Check-in cancelled for ${passenger?.name || 'passenger'}`, 'info');
      await fetchPassengers();
    } else {
      showToast('Undo check-in failed', 'error');
    }
  };

  const handleSeatClick = (seat: string) => {
    const passenger = flightPassengers.find((p) => p.seat === seat);
    if (passenger) {
      setSelectedPassenger(passenger);
      setPassengerDetailsDialog(true);
    }
  };

  const handlePassengerSelect = (passenger: Passenger) => {
    setSelectedPassenger(passenger);
    setPassengerDetailsDialog(true);
  };

  const handleChangeSeat = async (newSeat: string) => {
    if (selectedPassenger) {
      const result = await changeSeat(selectedPassenger.id, newSeat);
      if (result) {
        showToast(`Seat changed to ${newSeat} for ${selectedPassenger.name}`, 'success');
        setChangeSeatDialog(false);
        await fetchPassengers();
      } else {
        showToast('Seat change failed', 'error');
      }
    }
  };

  const handleChangeSeatClick = (passenger: Passenger) => {
    setSelectedPassenger(passenger);
    setChangeSeatDialog(true);
  };

  const handleViewBoardingPass = (passenger: Passenger) => {
    setSelectedPassenger(passenger);
    setBoardingPassDialog(true);
  };

  const handleFilterChange = (filterType: string, value: boolean | null) => {
    setFilter({ [filterType]: value });
  };

  const handleClearFilters = () => {
    clearFilters();
  };

  return (
    <Container className="staff-checkin" maxWidth="xl" sx={{ py: { xs: 2, sm: 3 }, minWidth: 0 }}>
      <PageHeader
        title="Staff Check-In"
        isConnected={isConnected}
        selectedFlightNumber={selectedFlight?.flightNumber}
      />

      <Grid container spacing={{ xs: 2, sm: 3 }} sx={{ minWidth: 0 }}>
        {/* Flight Selection */}
        <Grid size={{ xs: 12, md: 3 }} sx={{ minWidth: 0 }}>
          <FlightSelectionPanel
            flights={flights}
            selectedFlightId={selectedFlight?.id}
            onFlightSelect={handleFlightSelect}
            passengers={passengers}
          />
        </Grid>

        {/* Main Content */}
        <Grid size={{ xs: 12, md: 9 }} sx={{ minWidth: 0 }}>
          {selectedFlight ? (
            <>
              {/* Flight Details */}
              <FlightInfoGrid flight={selectedFlight} />

              {/* Group & Family Seating Actions */}
              <Stack direction="row" spacing={2} sx={{ mb: 2, flexWrap: 'wrap', rowGap: 1 }}>
                <Button
                  variant="outlined"
                  startIcon={<GroupIcon />}
                  onClick={() => setGroupSeatingDialog(true)}
                  size="small"
                >
                  Group Seating
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<FamilyRestroomIcon />}
                  onClick={() => setFamilySeatingDialog(true)}
                  size="small"
                >
                  Family Seating
                </Button>
              </Stack>

              {/* Seat Arrangement Summary */}
              <Box sx={{ mb: 2 }}>
                <SeatArrangementSummary passengers={flightPassengers} totalSeats={60} />
              </Box>

              {/* Filters */}
              <CheckInFilters
                checkedInFilter={filterOptions.checkedIn ?? null}
                wheelchairFilter={filterOptions.wheelchair ?? false}
                infantFilter={filterOptions.infant ?? false}
                onFilterChange={handleFilterChange}
                onClearFilters={handleClearFilters}
              />

              <Grid container spacing={2} sx={{ minWidth: 0 }}>
                {/* Seat Map */}
                <Grid size={{ xs: 12, lg: 7 }} sx={{ minWidth: 0 }}>
                  <SeatMapVisual
                    passengers={flightPassengers}
                    onSeatClick={handleSeatClick}
                    mode="checkin"
                  />
                </Grid>

                {/* Passenger List */}
                <Grid size={{ xs: 12, lg: 5 }} sx={{ minWidth: 0 }}>
                  <PassengerListPanel
                    passengers={filteredPassengers}
                    selectedPassengerId={selectedPassenger?.id}
                    onPassengerSelect={handlePassengerSelect}
                    onCheckIn={handleCheckIn}
                    onUndoCheckIn={handleUndoCheckIn}
                    onChangeSeat={handleChangeSeatClick}
                    onViewBoardingPass={handleViewBoardingPass}
                  />
                </Grid>
              </Grid>

            </>
          ) : (
            <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, textAlign: 'center' }}>
              <Typography variant="h6" color="textSecondary" sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}>
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
          lockSeat={lockSeat}
          unlockSeat={unlockSeat}
          isSeatLocked={isSeatLocked}
        />
      )}

      {/* Seat Preferences Dialog */}
      {selectedPassenger && (
        <SeatPreferencesDialog
          open={seatPreferencesDialog}
          onClose={() => setSeatPreferencesDialog(false)}
          onSave={async (preferences) => {
            // If passenger has premium upgrade and selected window/aisle, auto-reallocate to matching premium seat
            const updateData: Partial<Passenger> = { seatPreferences: preferences };
            
            if (selectedPassenger.premiumUpgrade && preferences.position) {
              const occupiedSeats = new Set(flightPassengers.filter(p => p.id !== selectedPassenger.id).map(p => p.seat));
              let newSeat: string | null = null;
              
              // Premium rows are 1-3
              const premiumRows = [1, 2, 3];
              
              // Window seats are A and F
              if (preferences.position.includes('window')) {
                const windowLetters = ['A', 'F'];
                for (const row of premiumRows) {
                  for (const letter of windowLetters) {
                    const seat = `${row}${letter}`;
                    if (!occupiedSeats.has(seat)) {
                      newSeat = seat;
                      break;
                    }
                  }
                  if (newSeat) break;
                }
              }
              // Aisle seats are C and D
              else if (preferences.position.includes('aisle')) {
                const aisleLetters = ['C', 'D'];
                for (const row of premiumRows) {
                  for (const letter of aisleLetters) {
                    const seat = `${row}${letter}`;
                    if (!occupiedSeats.has(seat)) {
                      newSeat = seat;
                      break;
                    }
                  }
                  if (newSeat) break;
                }
              }
              
              if (newSeat) {
                updateData.seat = newSeat;
              }
            }
            
            const result = await updatePassenger(selectedPassenger.id, updateData);
            if (result) {
              const message = updateData.seat 
                ? `Seat preferences saved and moved to ${updateData.seat}` 
                : 'Seat preferences saved successfully';
              showToast(message, 'success');
              setSeatPreferencesDialog(false);
              setSelectedPassenger(result);
              await fetchPassengers();
            } else {
              showToast('Failed to save seat preferences', 'error');
            }
          }}
          passengerName={selectedPassenger.name}
          currentPreferences={selectedPassenger.seatPreferences}
        />
      )}

      <Dialog open={passengerDetailsDialog} onClose={() => setPassengerDetailsDialog(false)} fullWidth maxWidth="sm">
        <DialogTitle>Passenger Details</DialogTitle>
        <DialogContent dividers>
          {selectedPassenger ? (
            <PassengerDetailsPanel
              passenger={selectedPassenger}
              onSetPreferences={() => {
                setPassengerDetailsDialog(false);
                setSeatPreferencesDialog(true);
              }}
              onOfferPremiumUpgrade={() => {
                setPassengerDetailsDialog(false);
                setPremiumSeatDialog(true);
              }}
              onViewBoardingPass={() => {
                setPassengerDetailsDialog(false);
                setBoardingPassDialog(true);
              }}
            />
          ) : (
            <Typography variant="body1" color="text.secondary">
              Select a passenger to view details.
            </Typography>
          )}
        </DialogContent>
      </Dialog>

      <BoardingPassDialog
        open={boardingPassDialog}
        passenger={selectedPassenger}
        flight={selectedFlight}
        onClose={() => setBoardingPassDialog(false)}
      />

      {/* Group Seating Dialog */}
      {selectedFlight && (
        <GroupSeatingDialog
          key={groupSeatingDialog ? 'group-open' : 'group-closed'}
          open={groupSeatingDialog}
          onClose={() => setGroupSeatingDialog(false)}
          flightId={selectedFlight.id}
          passengers={flightPassengers.filter(p => !p.checkedIn)}
          onAllocate={async (groupSeating, passengerIds, allocatedSeats) => {
            const results = await Promise.all(
              passengerIds.map((passengerId, index) => 
                updatePassenger(passengerId, { groupSeating, seat: allocatedSeats[index] })
              )
            );
            const successCount = results.filter(r => r !== null).length;
            if (successCount > 0) {
              showToast(`Group seating allocated for ${successCount} passengers in nearby seats`, 'success');
              setGroupSeatingDialog(false);
              await fetchPassengers();
            } else {
              showToast('Failed to allocate group seating', 'error');
            }
          }}
        />
      )}

      {/* Family Seating Dialog */}
      {selectedFlight && (
        <FamilySeatingDialog
          key={familySeatingDialog ? 'family-open' : 'family-closed'}
          open={familySeatingDialog}
          onClose={() => setFamilySeatingDialog(false)}
          flightId={selectedFlight.id}
          passengers={flightPassengers.filter(p => !p.checkedIn)}
          onAllocate={async (familySeating, passengerIds, allocatedSeats) => {
            const results = await Promise.all(
              passengerIds.map((passengerId, index) => 
                updatePassenger(passengerId, { 
                  familySeating,
                  seat: allocatedSeats[index]
                })
              )
            );
            const successCount = results.filter(r => r !== null).length;
            if (successCount > 0) {
              showToast(`Family seating allocated for ${successCount} passengers in same row`, 'success');
              setFamilySeatingDialog(false);
              await fetchPassengers();
            } else {
              showToast('Failed to allocate family seating', 'error');
            }
          }}
        />
      )}

      {/* Premium Seat Upsell Dialog */}
      {selectedPassenger && selectedFlight && (
        <PremiumSeatUpsellDialog
          open={premiumSeatDialog}
          onClose={() => setPremiumSeatDialog(false)}
          passenger={selectedPassenger}
          availableUpgrades={(() => {
            // Premium seats are rows 1-3 (front of cabin with extra legroom)
            const premiumRows = [1, 2, 3];
            const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
            const occupiedSeats = new Set(flightPassengers.map(p => p.seat));
            
            const availableSeats = [];
            for (const row of premiumRows) {
              for (const letter of seatLetters) {
                const seat = `${row}${letter}`;
                if (!occupiedSeats.has(seat)) {
                  availableSeats.push({
                    seatNumber: seat,
                    basePrice: row === 1 ? 299 : row === 2 ? 199 : 149,
                    upgradePrice: row === 1 ? 200 : row === 2 ? 120 : 80,
                    currency: 'USD',
                    features: row === 1 ? [
                      'Extra legroom (5+ inches)',
                      'Priority boarding',
                      'Complimentary drinks & meals',
                      'Power outlet & USB port',
                      'Enhanced recline',
                      'Premium amenity kit'
                    ] : [
                      'Priority boarding',
                      'Preferred cabin location',
                      row === 2 ? 'Complimentary snacks & drinks' : 'Complimentary snacks',
                      'Power outlet & USB port',
                      'Enhanced recline'
                    ],
                    available: true,
                  });
                }
              }
            }
            
            return availableSeats.slice(0, 8); // Show up to 8 options
          })()}
          onUpgrade={async (seatNumber) => {
            const result = await updatePassenger(selectedPassenger.id, { 
              seat: seatNumber,
              premiumUpgrade: true 
            });
            if (result) {
              showToast(`Upgraded to premium seat ${seatNumber}`, 'success');
              setPremiumSeatDialog(false);
              setSelectedPassenger(result);
              // Refresh passengers to update the UI
              await fetchPassengers();
            } else {
              showToast('Failed to upgrade seat', 'error');
            }
          }}
          currency="USD"
          locale="en"
        />
      )}
    </Container>
  );
};

export default StaffCheckIn;
