"use client";

import React, { useState, useEffect, useRef } from "react";
import useAdminStore from "@/stores/useAdminStore";
import useDataStore from "@/stores/useDataStore";
import useToastStore from "@/stores/useToastStore";
import useRealtimeUpdates from "@/hooks/useRealtimeUpdates";
import SimpleInputDialog from "@/components/common/SimpleInputDialog";
import ConfirmDialog from "@/components/common/ConfirmDialog";
import PassengerTab from "@/components/admin/tabs/PassengerTab";
import ServicesMenuTab from "@/components/admin/tabs/ServicesMenuTab";
import SeatManagementTab from "@/components/admin/tabs/SeatManagementTab";
import FlightOpsTab from "@/components/admin/tabs/FlightOpsTab";
import CrewManagementTab from "@/components/admin/tabs/CrewManagementTab";
import AircraftManagementTab from "@/components/admin/tabs/AircraftManagementTab";
import AdminMetrics from "@/components/admin/AdminMetrics";
import ShopItemDialog from "@/components/admin/ShopItemDialog";
import PageHeader from "@/components/ui/PageHeader";
import type { ShopItemDialogFormData } from "@/lib/validationSchemas";
import type { ShopItem } from "@/types/services";
import {
  Container,
  Paper,
  Tabs,
  Tab,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";
import AirlineSeatReclineExtraIcon from "@mui/icons-material/AirlineSeatReclineExtra";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import GroupsIcon from "@mui/icons-material/Groups";
import FlightIcon from "@mui/icons-material/Flight";

export type AdminDashboardTab = "passengers" | "services" | "seats" | "flights" | "crew" | "aircraft";

interface ConfirmDialogState {
  open: boolean;
  title?: string;
  message: string;
  severity?: "info" | "error" | "warning" | "success";
  onConfirm: () => void;
}

interface AdminDashboardProps {
  initialTab?: AdminDashboardTab;
}

const adminTabIndexes: Record<AdminDashboardTab, number> = {
  passengers: 0,
  services: 1,
  seats: 2,
  flights: 3,
  crew: 4,
  aircraft: 5,
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ initialTab = "passengers" }) => {
  const {
    flights,
    passengers,
    ancillaryServices,
    mealOptions,
    shopItems,
    error: dataStoreError,
    fetchFlights,
    fetchPassengers,
    fetchCatalog,
    addFlight,
    addPassenger,
    updateFlight,
    deleteFlight,
    updatePassenger,
    deletePassenger,
    addAncillaryService,
    updateAncillaryService,
    deleteAncillaryService,
    addMealOption,
    updateMealOption,
    deleteMealOption,
    addShopItem,
    updateShopItem,
    deleteShopItem,
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
      fetchCatalog();
      hasFetchedRef.current = true;
    }
  }, [flights.length, passengers.length, fetchFlights, fetchPassengers, fetchCatalog]);

  const [activeTab, setActiveTab] = useState(adminTabIndexes[initialTab]);
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
  const [shopItemForm, setShopItemForm] = useState<ShopItemDialogFormData>({
    id: "",
    name: "",
    category: "Perfumes & Cosmetics",
    price: 0,
    currency: "USD",
  });

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

  const handleSaveService = async () => {
    if (!serviceForm || !serviceForm.trim()) {
      showToast("Service name cannot be empty", "error");
      return;
    }
    const serviceName = serviceForm.trim();

    if (editingService) {
      const result = await updateAncillaryService(editingService, serviceName);
      showToast(result ? "Service updated successfully" : "Failed to update service", result ? "success" : "error");
    } else {
      const result = await addAncillaryService(serviceName);
      showToast(result ? "Service added successfully" : "Failed to add service", result ? "success" : "error");
    }
    setServiceDialog(false);
  };

  const handleDeleteService = (service: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete Service",
      message: `Delete "${service}"?`,
      severity: "error",
      onConfirm: async () => {
        const result = await deleteAncillaryService(service);
        showToast(result ? "Service deleted successfully" : "Failed to delete service", result ? "success" : "error");
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

  const handleSaveMeal = async () => {
    if (!mealForm || !mealForm.trim()) {
      showToast("Meal option name cannot be empty", "error");
      return;
    }
    const mealName = mealForm.trim();

    if (editingMeal) {
      const result = await updateMealOption(editingMeal, mealName);
      showToast(result ? "Meal option updated successfully" : "Failed to update meal option", result ? "success" : "error");
    } else {
      const result = await addMealOption(mealName);
      showToast(result ? "Meal option added successfully" : "Failed to add meal option", result ? "success" : "error");
    }
    setMealDialog(false);
  };

  const handleDeleteMeal = (meal: string) => {
    setConfirmDialog({
      open: true,
      title: "Delete Meal",
      message: `Delete "${meal}"?`,
      severity: "error",
      onConfirm: async () => {
        const result = await deleteMealOption(meal);
        showToast(result ? "Meal option deleted successfully" : "Failed to delete meal option", result ? "success" : "error");
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

  const handleSaveShopItem = async (formData: ShopItemDialogFormData) => {
    if (editMode) {
      const result = await updateShopItem(formData.id, formData);
      showToast(result ? `${formData.name} updated successfully` : "Failed to update shop item", result ? "success" : "error");
    } else {
      const result = await addShopItem({ ...formData, id: `SHOP${Date.now()}` });
      showToast(result ? `${formData.name} added successfully` : "Failed to add shop item", result ? "success" : "error");
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
      onConfirm: async () => {
        const result = await deleteShopItem(id);
        showToast(result ? `${item?.name || "Item"} deleted successfully` : "Failed to delete shop item", result ? "success" : "error");
      },
    });
  };

  return (
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
      <PageHeader
        title="Admin Dashboard"
        description="Manage passengers, flights, and services"
        icon={<SettingsIcon color="primary" />}
        isConnected={isConnected}
      />

      <AdminMetrics flights={flights} passengers={passengers} />

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
          <Tab
            label="Flight Ops"
            icon={<FlightTakeoffIcon />}
            iconPosition="start"
          />
          <Tab
            label="Crew"
            icon={<GroupsIcon />}
            iconPosition="start"
          />
          <Tab
            label="Aircraft"
            icon={<FlightIcon />}
            iconPosition="start"
          />
        </Tabs>

        {activeTab === 0 && (
          <PassengerTab
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
          <ServicesMenuTab
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
          <SeatManagementTab
            passengers={passengers}
            flights={flights}
            selectedFlight={selectedFlight}
            onUpdatePassenger={async (id, data) => {
              const result = await updatePassenger(id, data);
              if (result) {
                await fetchPassengers();
              }
              return !!result;
            }}
            onFetchPassengers={fetchPassengers}
            onShowToast={showToast}
            onConfirm={(config) => setConfirmDialog({ open: true, ...config })}
          />
        )}

        {activeTab === 3 && (
          <FlightOpsTab
            flights={flights}
            onAddFlight={async (flight) => {
              const result = await addFlight(flight);
              if (result) {
                await fetchFlights();
                showToast(`${result.flightNumber} created successfully`, "success");
              } else {
                showToast("Failed to create flight", "error");
              }
              return !!result;
            }}
            onUpdateFlight={async (id, updates) => {
              const result = await updateFlight(id, updates);
              if (result) {
                if (selectedFlight?.id === id) {
                  selectFlight(result);
                }
                await fetchFlights();
                showToast(`${result.flightNumber} updated successfully`, "success");
              } else {
                showToast("Failed to update flight", "error");
              }
              return !!result;
            }}
            onDeleteFlight={async (id) => {
              const result = await deleteFlight(id);
              if (result) {
                if (selectedFlight?.id === id) {
                  selectFlight(null);
                }
                await fetchFlights();
                await fetchPassengers();
                showToast(`${result.flightNumber} deleted successfully`, "success");
              } else {
                showToast("Failed to delete flight", "error");
              }
              return !!result;
            }}
          />
        )}

        {activeTab === 4 && (
          <CrewManagementTab
            flights={flights}
            onUpdateFlight={async (id, updates) => {
              const result = await updateFlight(id, updates);
              if (result) {
                if (selectedFlight?.id === id) {
                  selectFlight(result);
                }
                await fetchFlights();
                showToast(`${result.flightNumber} crew updated successfully`, "success");
              } else {
                showToast("Failed to update crew", "error");
              }
              return !!result;
            }}
          />
        )}

        {activeTab === 5 && (
          <AircraftManagementTab
            flights={flights}
            onUpdateFlight={async (id, updates) => {
              const result = await updateFlight(id, updates);
              if (result) {
                if (selectedFlight?.id === id) {
                  selectFlight(result);
                }
                await fetchFlights();
                showToast(`${result.flightNumber} aircraft updated successfully`, "success");
              } else {
                showToast("Failed to update aircraft", "error");
              }
              return !!result;
            }}
          />
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
    </Container>
  );
};

export default AdminDashboard;
