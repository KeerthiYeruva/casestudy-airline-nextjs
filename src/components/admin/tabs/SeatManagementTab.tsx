"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
} from "@mui/material";
import SeatPreferencesDialog from "../../seats/SeatPreferencesDialog";
import GroupSeatingDialog from "../../seats/GroupSeatingDialog";
import FamilySeatingDialog from "../../seats/FamilySeatingDialog";
import PremiumSeatUpsellDialog from "../../seats/PremiumSeatUpsellDialog";
import PassengerSelectionDialog from "../PassengerSelectionDialog";
import { Passenger, Flight, SeatPreferences, GroupSeating, FamilySeating } from "@/types";

interface SeatManagementTabProps {
  passengers: Passenger[];
  flights: Flight[];
  selectedFlight: Flight | null;
  onUpdatePassenger: (id: string, data: Partial<Passenger>) => Promise<boolean>;
  onFetchPassengers: () => Promise<void>;
  onShowToast: (message: string, severity: "success" | "error" | "info" | "warning") => void;
  onConfirm: (config: {
    title: string;
    message: string;
    severity: "info" | "error" | "warning" | "success";
    onConfirm: () => void;
  }) => void;
}

const SeatManagementTab: React.FC<SeatManagementTabProps> = ({
  passengers,
  flights,
  selectedFlight,
  onUpdatePassenger,
  onFetchPassengers,
  onShowToast,
  onConfirm,
}) => {
  const [seatPreferencesDialog, setSeatPreferencesDialog] = useState(false);
  const [groupSeatingDialog, setGroupSeatingDialog] = useState(false);
  const [familySeatingDialog, setFamilySeatingDialog] = useState(false);
  const [premiumSeatDialog, setPremiumSeatDialog] = useState(false);
  const [passengerSelectionDialog, setPassengerSelectionDialog] = useState(false);
  const [premiumSelectionDialog, setPremiumSelectionDialog] = useState(false);
  const [selectedPassengerForSeat, setSelectedPassengerForSeat] = useState<string | null>(null);



  const handleClearAllPreferences = () => {
    const prefPassengers = passengers.filter(p => p.seatPreferences);
    onConfirm({
      title: 'Clear All Seat Preferences',
      message: `Remove seat preferences from ${prefPassengers.length} passenger(s)?`,
      severity: 'info',
      onConfirm: async () => {
        const results = await Promise.all(
          prefPassengers.map(p => onUpdatePassenger(p.id, { seatPreferences: undefined }))
        );
        if (results.every(r => r)) {
          onShowToast('Seat preferences cleared', 'success');
          await onFetchPassengers();
        }
      }
    });
  };

  const handleRemoveAllPremium = () => {
    const premiumPassengers = passengers.filter(p => p.premiumUpgrade);
    onConfirm({
      title: 'Remove All Premium Upgrades',
      message: `Remove premium upgrade from ${premiumPassengers.length} passenger(s)?`,
      severity: 'warning',
      onConfirm: async () => {
        const results = await Promise.all(
          premiumPassengers.map(p => onUpdatePassenger(p.id, { premiumUpgrade: false }))
        );
        if (results.every(r => r)) {
          onShowToast('Premium upgrades removed', 'success');
          await onFetchPassengers();
        }
      }
    });
  };

  const handleClearAllGroupSeating = () => {
    const groupPassengers = passengers.filter(p => p.groupSeating);
    onConfirm({
      title: 'Clear All Group Seating',
      message: `Remove group seating from ${groupPassengers.length} passenger(s)?`,
      severity: 'warning',
      onConfirm: async () => {
        const results = await Promise.all(
          groupPassengers.map(p => onUpdatePassenger(p.id, { groupSeating: undefined }))
        );
        if (results.every(r => r)) {
          onShowToast('Group seating cleared for all passengers', 'success');
          await onFetchPassengers();
        } else {
          onShowToast('Failed to clear group seating', 'error');
        }
      }
    });
  };

  const handleClearAllFamilySeating = () => {
    const familyPassengers = passengers.filter(p => p.familySeating);
    onConfirm({
      title: 'Clear All Family Seating',
      message: `Remove family seating from ${familyPassengers.length} passenger(s)?`,
      severity: 'warning',
      onConfirm: async () => {
        const results = await Promise.all(
          familyPassengers.map(p => onUpdatePassenger(p.id, { familySeating: undefined }))
        );
        if (results.every(r => r)) {
          onShowToast('Family seating cleared for all passengers', 'success');
          await onFetchPassengers();
        } else {
          onShowToast('Failed to clear family seating', 'error');
        }
      }
    });
  };

  const handleSaveSeatPreferences = async (preferences: SeatPreferences) => {
    const passengerId = selectedPassengerForSeat;
    if (passengerId) {
      const passenger = passengers.find(p => p.id === passengerId);
      const updateData: Partial<Passenger> = { seatPreferences: preferences };
      
      // If passenger has premium upgrade and selected window/aisle, auto-reallocate to matching premium seat
      if (passenger?.premiumUpgrade && preferences.position) {
        const occupiedSeats = new Set(passengers.filter(p => p.id !== passengerId).map(p => p.seat));
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
      
      const result = await onUpdatePassenger(passengerId, updateData);
      if (result) {
        const message = updateData.seat 
          ? `Preferences saved and moved to ${updateData.seat}` 
          : 'Seat preferences saved';
        onShowToast(message, 'success');
        await onFetchPassengers();
      } else {
        onShowToast('Failed to save seat preferences', 'error');
      }
    }
    setSeatPreferencesDialog(false);
    setSelectedPassengerForSeat(null);
  };

  const handleAllocateGroupSeating = async (groupSeating: GroupSeating, passengerIds: string[]) => {
    const results = await Promise.all(
      passengerIds.map(passengerId => onUpdatePassenger(passengerId, { groupSeating }))
    );
    const allSuccess = results.every(r => r);
    if (allSuccess) {
      onShowToast(`Group seating allocated for ${passengerIds.length} passengers`, 'success');
      await onFetchPassengers();
    } else {
      onShowToast('Failed to allocate group seating', 'error');
    }
    setGroupSeatingDialog(false);
  };

  const handleAllocateFamilySeating = async (
    familySeating: FamilySeating,
    passengerIds: string[],
    allocatedSeats: string[]
  ) => {
    const results = await Promise.all(
      passengerIds.map((passengerId, index) => 
        onUpdatePassenger(passengerId, { 
          familySeating,
          seat: allocatedSeats[index]
        })
      )
    );
    const allSuccess = results.every(r => r);
    if (allSuccess) {
      onShowToast(`Family seating allocated for ${passengerIds.length} passengers in same row`, 'success');
      await onFetchPassengers();
    } else {
      onShowToast('Failed to allocate family seating', 'error');
    }
    setFamilySeatingDialog(false);
  };

  const handlePremiumUpgrade = async (seatNumber: string) => {
    const passengerId = selectedPassengerForSeat;
    if (passengerId) {
      const result = await onUpdatePassenger(passengerId, { 
        seat: seatNumber,
        premiumUpgrade: true 
      });
      if (result) {
        onShowToast(`Upgraded to premium seat ${seatNumber}`, 'success');
        await onFetchPassengers();
      } else {
        onShowToast('Failed to upgrade premium seat', 'error');
      }
    }
    setPremiumSeatDialog(false);
    setSelectedPassengerForSeat(null);
  };

  const getAvailablePremiumUpgrades = () => {
    // Premium seats are rows 1-3 (front of cabin with extra legroom)
    const premiumRows = [1, 2, 3];
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const occupiedSeats = new Set(passengers.map(p => p.seat));
    
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
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Advanced Seat Management
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Manage seat preferences, group seating, family allocations, and premium upgrades
      </Typography>

      <Paper elevation={1} sx={{ p: 2, mb: 3, bgcolor: 'info.50', borderLeft: 4, borderColor: 'info.main' }}>
        <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
          Quick Actions
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {passengers.filter(p => p.seatPreferences).length > 0 && (
            <Button
              variant="outlined"
              color="info"
              size="small"
              onClick={handleClearAllPreferences}
            >
              Clear All Preferences ({passengers.filter(p => p.seatPreferences).length})
            </Button>
          )}
          {passengers.filter(p => p.premiumUpgrade).length > 0 && (
            <Button
              variant="outlined"
              color="warning"
              size="small"
              onClick={handleRemoveAllPremium}
            >
              Remove All Premium ({passengers.filter(p => p.premiumUpgrade).length})
            </Button>
          )}
        </Box>
      </Paper>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 3 }}>
        <Box sx={{ minWidth: 250, flex: 1 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Seat Preferences
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Set passenger seat preferences (window, aisle, etc.)
          </Typography>
          <Button
            variant="contained"
            onClick={() => setPassengerSelectionDialog(true)}
            fullWidth
            disabled={passengers.length === 0}
          >
            Set Seat Preferences
          </Button>
          {passengers.filter(p => p.seatPreferences).length > 0 && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
              {passengers.filter(p => p.seatPreferences).length} passenger(s) with preferences
            </Typography>
          )}
        </Box>

        <Box sx={{ minWidth: 250 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Group Seating
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Allocate seats for groups traveling together
          </Typography>
          <Button
            variant="contained"
            onClick={() => setGroupSeatingDialog(true)}
            fullWidth
            sx={{ mb: 1 }}
          >
            Allocate Group Seating
          </Button>
          {passengers.filter(p => p.groupSeating).length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearAllGroupSeating}
              fullWidth
              size="small"
            >
              Clear All ({passengers.filter(p => p.groupSeating).length})
            </Button>
          )}
        </Box>

        <Box sx={{ minWidth: 250 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Family Seating
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Auto-allocate seats for families with safety rules
          </Typography>
          <Button
            variant="contained"
            onClick={() => setFamilySeatingDialog(true)}
            fullWidth
            sx={{ mb: 1 }}
          >
            Allocate Family Seating
          </Button>
          {passengers.filter(p => p.familySeating).length > 0 && (
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearAllFamilySeating}
              fullWidth
              size="small"
            >
              Clear All ({passengers.filter(p => p.familySeating).length})
            </Button>
          )}
        </Box>

        <Box sx={{ minWidth: 250, flex: 1 }}>
          <Typography variant="subtitle1" gutterBottom fontWeight="bold">
            Premium Seat Upsell
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Offer premium seat upgrades to passengers
          </Typography>
          <Button
            variant="contained"
            color="warning"
            onClick={() => setPremiumSelectionDialog(true)}
            fullWidth
            disabled={passengers.filter(p => !p.premiumUpgrade).length === 0}
          >
            Offer Premium Upgrade
          </Button>
          <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
            {passengers.filter(p => !p.premiumUpgrade).length} eligible passenger(s)
          </Typography>
        </Box>
      </Box>

      {/* Passenger Selection Dialogs */}
      <PassengerSelectionDialog
        open={passengerSelectionDialog}
        onClose={() => setPassengerSelectionDialog(false)}
        passengers={passengers}
        onSelect={(passengerId) => {
          setSelectedPassengerForSeat(passengerId);
          setSeatPreferencesDialog(true);
        }}
        title="Select Passenger for Seat Preferences"
      />

      <PassengerSelectionDialog
        open={premiumSelectionDialog}
        onClose={() => setPremiumSelectionDialog(false)}
        passengers={passengers}
        onSelect={(passengerId) => {
          setSelectedPassengerForSeat(passengerId);
          setPremiumSeatDialog(true);
        }}
        title="Select Passenger for Premium Upgrade"
        filterPredicate={(p) => !p.premiumUpgrade}
      />

      {/* Seat Management Dialogs */}
      <SeatPreferencesDialog
        open={seatPreferencesDialog}
        onClose={() => {
          setSeatPreferencesDialog(false);
          setSelectedPassengerForSeat(null);
        }}
        onSave={handleSaveSeatPreferences}
        passengerName={passengers.find(p => p.id === selectedPassengerForSeat)?.name || ''}
        currentPreferences={passengers.find(p => p.id === selectedPassengerForSeat)?.seatPreferences}
      />

      <GroupSeatingDialog
        open={groupSeatingDialog}
        onClose={() => setGroupSeatingDialog(false)}
        flightId={selectedFlight?.id || flights[0]?.id || ''}
        passengers={passengers.filter(p => 
          !p.flightId || p.flightId === (selectedFlight?.id || flights[0]?.id)
        )}
        onAllocate={handleAllocateGroupSeating}
      />

      <FamilySeatingDialog
        open={familySeatingDialog}
        onClose={() => setFamilySeatingDialog(false)}
        flightId={selectedFlight?.id || flights[0]?.id || ''}
        passengers={passengers.filter(p => 
          !p.flightId || p.flightId === (selectedFlight?.id || flights[0]?.id)
        )}
        onAllocate={handleAllocateFamilySeating}
      />

      <PremiumSeatUpsellDialog
        open={premiumSeatDialog}
        onClose={() => {
          setPremiumSeatDialog(false);
          setSelectedPassengerForSeat(null);
        }}
        passenger={passengers.find(p => p.id === selectedPassengerForSeat) || passengers[0]}
        availableUpgrades={getAvailablePremiumUpgrades()}
        onUpgrade={handlePremiumUpgrade}
        currency="USD"
        locale="en"
      />
    </Box>
  );
};

export default SeatManagementTab;
