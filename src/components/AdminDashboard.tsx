"use client";

import React, { useState, useEffect, useRef } from "react";
import useAdminStore from "@/stores/useAdminStore";
import useDataStore from "@/stores/useDataStore";
import useToastStore from "@/stores/useToastStore";
import useRealtimeUpdates from "@/hooks/useRealtimeUpdates";
import SimpleInputDialog from "./SimpleInputDialog";
import ConfirmDialog from "./ConfirmDialog";
import PassengerManagement from "./admin/PassengerManagement";
import ServicesMenuManagement from "./admin/ServicesMenuManagement";
import ShopItemDialog from "./admin/ShopItemDialog";
import { ShopItem } from "@/types";
import {
  Container,
  Paper,
  Typography,
  Tabs,
  Tab,
  Box,
  Chip,
  Button,
  TextField,
  InputAdornment,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import WifiIcon from "@mui/icons-material/Wifi";
import WifiOffIcon from "@mui/icons-material/WifiOff";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";
import SeatPreferencesDialog from "./seats/SeatPreferencesDialog";
import GroupSeatingDialog from "./seats/GroupSeatingDialog";
import FamilySeatingDialog from "./seats/FamilySeatingDialog";
import PremiumSeatUpsellDialog from "./seats/PremiumSeatUpsellDialog";

interface ShopItemFormData {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
}

interface ConfirmDialogState {
  open: boolean;
  title?: string;
  message: string;
  severity?: "info" | "error" | "warning" | "success";
  onConfirm: () => void;
}

const AdminDashboard: React.FC = () => {
  const {
    flights,
    passengers,
    ancillaryServices,
    mealOptions,
    shopItems,
    error: dataStoreError,
    fetchFlights,
    fetchPassengers,
    addPassenger,
    updatePassenger,
    deletePassenger,
    setAncillaryServices,
    setMealOptions,
    setShopItems,
    resetToInitialData,
  } = useDataStore();
  const {
    selectedFlight,
    filterOptions,
    selectFlight,
    setAdminFilter,
    clearAdminFilters,
  } = useAdminStore();
  const { showToast } = useToastStore();
  const { isConnected } = useRealtimeUpdates();
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

  const [activeTab, setActiveTab] = useState(0);
  const [serviceDialog, setServiceDialog] = useState(false);
  const [mealDialog, setMealDialog] = useState(false);
  const [shopItemDialog, setShopItemDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    message: "",
    onConfirm: () => {},
  });

  const [serviceForm, setServiceForm] = useState("");
  const [editingService, setEditingService] = useState("");
  const [mealForm, setMealForm] = useState("");
  const [editingMeal, setEditingMeal] = useState("");
  const [shopItemForm, setShopItemForm] = useState<ShopItemFormData>({
    id: "",
    name: "",
    category: "Perfumes & Cosmetics",
    price: 0,
    currency: "USD",
  });

  // Seat Management State
  const [seatPreferencesDialog, setSeatPreferencesDialog] = useState(false);
  const [groupSeatingDialog, setGroupSeatingDialog] = useState(false);
  const [familySeatingDialog, setFamilySeatingDialog] = useState(false);
  const [premiumSeatDialog, setPremiumSeatDialog] = useState(false);
  const [selectedPassengerForSeat, setSelectedPassengerForSeat] = useState<string | null>(null);
  const [seatSearchQuery, setSeatSearchQuery] = useState("");

  const handleFlightSelect = (flightId: string) => {
    const flight = flights.find((f) => f.id === flightId) || null;
    selectFlight(flight);
  };

  const handleOpenServiceDialog = (service: string | null = null) => {
    if (service) {
      setEditingService(service);
      setServiceForm(service);
    } else {
      setEditingService("");
      setServiceForm("");
    }
    setServiceDialog(true);
  };

  const handleSaveService = () => {
    if (!serviceForm || !serviceForm.trim()) {
      showToast("Service name cannot be empty", "error");
      return;
    }
    if (editingService) {
      const updated = ancillaryServices.map((s) =>
        s === editingService ? serviceForm.trim() : s
      );
      setAncillaryServices(updated);
      showToast("Service updated successfully", "success");
    } else {
      setAncillaryServices([...ancillaryServices, serviceForm.trim()]);
      showToast("Service added successfully", "success");
    }
    setServiceDialog(false);
  };

  const handleDeleteService = (service: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete Service",
      message: `Delete "${service}"?`,
      severity: "error",
      onConfirm: () => {
        setAncillaryServices(ancillaryServices.filter((s) => s !== service));
        showToast("Service deleted successfully", "success");
      },
    });
  };

  const handleOpenMealDialog = (meal: string | null = null) => {
    if (meal) {
      setEditingMeal(meal);
      setMealForm(meal);
    } else {
      setEditingMeal("");
      setMealForm("");
    }
    setMealDialog(true);
  };

  const handleSaveMeal = () => {
    if (!mealForm || !mealForm.trim()) {
      showToast("Meal option name cannot be empty", "error");
      return;
    }
    if (editingMeal) {
      const updated = mealOptions.map((m) =>
        m === editingMeal ? mealForm.trim() : m
      );
      setMealOptions(updated);
      showToast("Meal option updated successfully", "success");
    } else {
      setMealOptions([...mealOptions, mealForm.trim()]);
      showToast("Meal option added successfully", "success");
    }
    setMealDialog(false);
  };

  const handleDeleteMeal = (meal: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete Meal",
      message: `Delete "${meal}"?`,
      severity: "error",
      onConfirm: () => {
        setMealOptions(mealOptions.filter((m) => m !== meal));
        showToast("Meal option deleted successfully", "success");
      },
    });
  };

  const handleOpenShopItemDialog = (item: ShopItem | null = null) => {
    if (item) {
      setEditMode(true);
      setShopItemForm(item);
    } else {
      setEditMode(false);
      setShopItemForm({
        id: `SHOP${Date.now()}`,
        name: "",
        category: "Perfumes & Cosmetics",
        price: 0,
        currency: "USD",
      });
    }
    setShopItemDialog(true);
  };

  const handleSaveShopItem = () => {
    if (!shopItemForm.name || !shopItemForm.name.trim()) {
      showToast("Item name is required", "error");
      return;
    }
    if (!shopItemForm.price || shopItemForm.price <= 0) {
      showToast("Item price must be greater than 0", "error");
      return;
    }
    if (editMode) {
      const updated = shopItems.map((item) =>
        item.id === shopItemForm.id ? shopItemForm : item
      );
      setShopItems(updated);
      showToast(`${shopItemForm.name} updated successfully`, "success");
    } else {
      setShopItems([
        ...shopItems,
        { ...shopItemForm, id: `SHOP${Date.now()}` },
      ]);
      showToast(`${shopItemForm.name} added successfully`, "success");
    }
    setShopItemDialog(false);
  };

  const handleDeleteShopItem = (id: string) => {
    const item = shopItems.find((i) => i.id === id);
    setConfirmDialog({
      open: true,
      title: "Delete Shop Item",
      message: `Are you sure you want to delete ${item?.name || "this item"}?`,
      severity: "error",
      onConfirm: () => {
        setShopItems(shopItems.filter((item) => item.id !== id));
        showToast(`${item?.name || "Item"} deleted successfully`, "success");
      },
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <SettingsIcon color="primary" />
            <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
              Admin Dashboard
            </Typography>
          </Box>
          <Chip 
            icon={isConnected ? <WifiIcon /> : <WifiOffIcon />}
            label={isConnected ? 'Live Updates' : 'Offline'}
            color={isConnected ? 'success' : 'default'}
            size="small"
            sx={{ ml: 'auto' }}
          />
        </Box>
        <Typography variant="body2" color="text.secondary">
          Manage passengers, flights, and services
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 } }}>
        <Tabs
          value={activeTab}
          onChange={(_e, v) => setActiveTab(v)}
          sx={{ mb: 3, borderBottom: 1, borderColor: 'divider' }}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Passengers" icon={<PersonIcon />} iconPosition="start" />
          <Tab
            label="Services & Menu"
            icon={<SettingsIcon />}
            iconPosition="start"
          />
          <Tab
            label="Seat Management"
            icon={<AirlineSeatReclineExtraIcon />}
            iconPosition="start"
          />
        </Tabs>

        {activeTab === 0 && (
          <PassengerManagement
            passengers={passengers}
            flights={flights}
            selectedFlightId={selectedFlight?.id || ""}
            onFlightSelect={handleFlightSelect}
            filterOptions={{
              missingPassport: filterOptions.missingPassport || false,
              missingAddress: filterOptions.missingAddress || false,
              missingDOB: filterOptions.missingDOB || false,
            }}
            onFilterChange={setAdminFilter}
            onClearFilters={clearAdminFilters}
            onResetData={resetToInitialData}
            dataStoreError={dataStoreError}
            onAddPassenger={async (passenger) => {
              const result = await addPassenger(passenger);
              return !!result;
            }}
            onUpdatePassenger={async (id, passenger) => {
              const result = await updatePassenger(id, passenger);
              if (result) {
                await fetchPassengers();
              }
              return !!result;
            }}
            onDeletePassenger={async (id) => {
              const result = await deletePassenger(id);
              if (result) {
                await fetchPassengers();
              }
              return !!result;
            }}
          />
        )}

        {activeTab === 1 && (
          <ServicesMenuManagement
            ancillaryServices={ancillaryServices}
            mealOptions={mealOptions}
            shopItems={shopItems}
            onAddService={() => handleOpenServiceDialog()}
            onEditService={handleOpenServiceDialog}
            onDeleteService={handleDeleteService}
            onAddMeal={() => handleOpenMealDialog()}
            onEditMeal={handleOpenMealDialog}
            onDeleteMeal={handleDeleteMeal}
            onAddShopItem={() => handleOpenShopItemDialog()}
            onEditShopItem={handleOpenShopItemDialog}
            onDeleteShopItem={handleDeleteShopItem}
          />
        )}

        {activeTab === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Advanced Seat Management
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Manage seat preferences, group seating, family allocations, and premium upgrades
            </Typography>
            
            <TextField
              fullWidth
              size="small"
              placeholder="Search passengers by name, seat, or flight..."
              value={seatSearchQuery}
              onChange={(e) => setSeatSearchQuery(e.target.value)}
              sx={{ mb: 3, maxWidth: 500 }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                  endAdornment: seatSearchQuery && (
                    <InputAdornment position="end">
                      <Button
                        size="small"
                        onClick={() => setSeatSearchQuery("")}
                        sx={{ minWidth: 'auto', p: 0.5 }}
                      >
                        <ClearIcon fontSize="small" />
                      </Button>
                    </InputAdornment>
                  ),
                },
              }}
            />

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
                    onClick={() => {
                      setConfirmDialog({
                        open: true,
                        title: 'Clear All Seat Preferences',
                        message: `Remove seat preferences from ${passengers.filter(p => p.seatPreferences).length} passenger(s)?`,
                        severity: 'info',
                        onConfirm: async () => {
                          const prefPassengers = passengers.filter(p => p.seatPreferences);
                          const results = await Promise.all(
                            prefPassengers.map(p => 
                              updatePassenger(p.id, { seatPreferences: undefined })
                            )
                          );
                          if (results.every(r => r)) {
                            showToast('Seat preferences cleared', 'success');
                            await fetchPassengers();
                          }
                        }
                      });
                    }}
                  >
                    Clear All Preferences ({passengers.filter(p => p.seatPreferences).length})
                  </Button>
                )}
                {passengers.filter(p => p.premiumUpgrade).length > 0 && (
                  <Button
                    variant="outlined"
                    color="warning"
                    size="small"
                    onClick={() => {
                      setConfirmDialog({
                        open: true,
                        title: 'Remove All Premium Upgrades',
                        message: `Remove premium upgrade from ${passengers.filter(p => p.premiumUpgrade).length} passenger(s)?`,
                        severity: 'warning',
                        onConfirm: async () => {
                          const premiumPassengers = passengers.filter(p => p.premiumUpgrade);
                          const results = await Promise.all(
                            premiumPassengers.map(p => 
                              updatePassenger(p.id, { premiumUpgrade: false })
                            )
                          );
                          if (results.every(r => r)) {
                            showToast('Premium upgrades removed', 'success');
                            await fetchPassengers();
                          }
                        }
                      });
                    }}
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
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', maxHeight: 300, overflowY: 'auto', pr: 1 }}>
                  {passengers
                    .filter((passenger) => {
                      if (!seatSearchQuery) return true;
                      const query = seatSearchQuery.toLowerCase();
                      return (
                        passenger.name.toLowerCase().includes(query) ||
                        passenger.seat.toLowerCase().includes(query) ||
                        passenger.flightId.toLowerCase().includes(query)
                      );
                    })
                    .map((passenger) => (
                      <Button
                        key={passenger.id}
                        variant="outlined"
                        size="small"
                        onClick={() => {
                          setSelectedPassengerForSeat(passenger.id);
                          setSeatPreferencesDialog(true);
                        }}
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        {passenger.name} ({passenger.seat}) - {passenger.flightId}
                      </Button>
                    ))}
                  {passengers.filter((passenger) => {
                    if (!seatSearchQuery) return true;
                    const query = seatSearchQuery.toLowerCase();
                    return (
                      passenger.name.toLowerCase().includes(query) ||
                      passenger.seat.toLowerCase().includes(query) ||
                      passenger.flightId.toLowerCase().includes(query)
                    );
                  }).length === 0 && (
                    <Typography variant="body2" color="text.secondary" align="center">
                      {seatSearchQuery ? 'No passengers match your search' : 'No passengers available'}
                    </Typography>
                  )}
                </Box>
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
                    onClick={() => {
                      setConfirmDialog({
                        open: true,
                        title: 'Clear All Group Seating',
                        message: `Remove group seating from ${passengers.filter(p => p.groupSeating).length} passenger(s)?`,
                        severity: 'warning',
                        onConfirm: async () => {
                          const groupPassengers = passengers.filter(p => p.groupSeating);
                          const results = await Promise.all(
                            groupPassengers.map(p => 
                              updatePassenger(p.id, { groupSeating: undefined })
                            )
                          );
                          if (results.every(r => r)) {
                            showToast('Group seating cleared for all passengers', 'success');
                            await fetchPassengers();
                          } else {
                            showToast('Failed to clear group seating', 'error');
                          }
                        }
                      });
                    }}
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
                    onClick={() => {
                      setConfirmDialog({
                        open: true,
                        title: 'Clear All Family Seating',
                        message: `Remove family seating from ${passengers.filter(p => p.familySeating).length} passenger(s)?`,
                        severity: 'warning',
                        onConfirm: async () => {
                          const familyPassengers = passengers.filter(p => p.familySeating);
                          const results = await Promise.all(
                            familyPassengers.map(p => 
                              updatePassenger(p.id, { familySeating: undefined })
                            )
                          );
                          if (results.every(r => r)) {
                            showToast('Family seating cleared for all passengers', 'success');
                            await fetchPassengers();
                          } else {
                            showToast('Failed to clear family seating', 'error');
                          }
                        }
                      });
                    }}
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
                <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', maxHeight: 300, overflowY: 'auto', pr: 1 }}>
                  {passengers
                    .filter(p => !p.premiumUpgrade)
                    .filter((passenger) => {
                      if (!seatSearchQuery) return true;
                      const query = seatSearchQuery.toLowerCase();
                      return (
                        passenger.name.toLowerCase().includes(query) ||
                        passenger.seat.toLowerCase().includes(query) ||
                        passenger.flightId.toLowerCase().includes(query)
                      );
                    })
                    .map((passenger) => (
                      <Button
                        key={passenger.id}
                        variant="outlined"
                        size="small"
                        color="warning"
                        onClick={() => {
                          setSelectedPassengerForSeat(passenger.id);
                          setPremiumSeatDialog(true);
                        }}
                        sx={{ justifyContent: 'flex-start' }}
                      >
                        {passenger.name} ({passenger.seat}) - {passenger.flightId}
                      </Button>
                    ))}
                  {passengers
                    .filter(p => !p.premiumUpgrade)
                    .filter((passenger) => {
                      if (!seatSearchQuery) return true;
                      const query = seatSearchQuery.toLowerCase();
                      return (
                        passenger.name.toLowerCase().includes(query) ||
                        passenger.seat.toLowerCase().includes(query) ||
                        passenger.flightId.toLowerCase().includes(query)
                      );
                    }).length === 0 && (
                    <Typography variant="body2" color="text.secondary" align="center">
                      {seatSearchQuery ? 'No passengers match your search' : 'All passengers have premium seats'}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
        )}
      </Paper>

      {/* Service Dialog */}
      <SimpleInputDialog
        open={serviceDialog}
        onClose={() => setServiceDialog(false)}
        title={editingService ? "Edit Service" : "Add Service"}
        label="Service Name"
        value={serviceForm}
        onChange={(e) => setServiceForm(e.target.value)}
        onSave={handleSaveService}
        editMode={!!editingService}
      />

      {/* Meal Dialog */}
      <SimpleInputDialog
        open={mealDialog}
        onClose={() => setMealDialog(false)}
        title={editingMeal ? "Edit Meal" : "Add Meal"}
        label="Meal Name"
        value={mealForm}
        onChange={(e) => setMealForm(e.target.value)}
        onSave={handleSaveMeal}
        editMode={!!editingMeal}
      />

      {/* Shop Item Dialog */}
      <ShopItemDialog
        open={shopItemDialog}
        onClose={() => setShopItemDialog(false)}
        editMode={editMode}
        shopItemForm={shopItemForm}
        onFormChange={setShopItemForm}
        onSave={handleSaveShopItem}
      />

      {/* Confirm Dialog */}
      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        severity={confirmDialog.severity}
      />

      {/* Seat Management Dialogs */}
      <SeatPreferencesDialog
        open={seatPreferencesDialog}
        onClose={() => {
          setSeatPreferencesDialog(false);
          setSelectedPassengerForSeat(null);
        }}
        onSave={async (preferences) => {
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
            
            const result = await updatePassenger(passengerId, updateData);
            if (result) {
              const message = updateData.seat 
                ? `Preferences saved and moved to ${updateData.seat}` 
                : 'Seat preferences saved';
              showToast(message, 'success');
              await fetchPassengers();
            } else {
              showToast('Failed to save seat preferences', 'error');
            }
          }
          setSeatPreferencesDialog(false);
          setSelectedPassengerForSeat(null);
        }}
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
        onAllocate={async (groupSeating, passengerIds) => {
          const results = await Promise.all(
            passengerIds.map(passengerId => updatePassenger(passengerId, { groupSeating }))
          );
          const allSuccess = results.every(r => r);
          if (allSuccess) {
            showToast(`Group seating allocated for ${passengerIds.length} passengers`, 'success');
            await fetchPassengers();
          } else {
            showToast('Failed to allocate group seating', 'error');
          }
          setGroupSeatingDialog(false);
        }}
      />

      <FamilySeatingDialog
        open={familySeatingDialog}
        onClose={() => setFamilySeatingDialog(false)}
        flightId={selectedFlight?.id || flights[0]?.id || ''}
        passengers={passengers.filter(p => 
          !p.flightId || p.flightId === (selectedFlight?.id || flights[0]?.id)
        )}
        onAllocate={async (familySeating, passengerIds, allocatedSeats) => {
          const results = await Promise.all(
            passengerIds.map((passengerId, index) => 
              updatePassenger(passengerId, { 
                familySeating,
                seat: allocatedSeats[index]
              })
            )
          );
          const allSuccess = results.every(r => r);
          if (allSuccess) {
            showToast(`Family seating allocated for ${passengerIds.length} passengers in same row`, 'success');
            await fetchPassengers();
          } else {
            showToast('Failed to allocate family seating', 'error');
          }
          setFamilySeatingDialog(false);
        }}
      />

      <PremiumSeatUpsellDialog
        open={premiumSeatDialog}
        onClose={() => {
          setPremiumSeatDialog(false);
          setSelectedPassengerForSeat(null);
        }}
        passenger={passengers.find(p => p.id === selectedPassengerForSeat) || passengers[0]}
        availableUpgrades={(() => {
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
        })()}
        onUpgrade={async (seatNumber) => {
          const passengerId = selectedPassengerForSeat;
          if (passengerId) {
            const result = await updatePassenger(passengerId, { 
              seat: seatNumber,
              premiumUpgrade: true 
            });
            if (result) {
              showToast(`Upgraded to premium seat ${seatNumber}`, 'success');
              // Refresh passengers to update the UI
              await fetchPassengers();
            } else {
              showToast('Failed to upgrade premium seat', 'error');
            }
          }
          setPremiumSeatDialog(false);
          setSelectedPassengerForSeat(null);
        }}
        currency="USD"
        locale="en"
      />
    </Container>
  );
};

export default AdminDashboard;
