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
import AdminMetrics from "@/components/admin/AdminMetrics";
import ShopItemDialog from "@/components/admin/ShopItemDialog";
import PageHeader from "@/components/ui/PageHeader";
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

  const handleSaveShopItem = (formData: ShopItemFormData) => {
    if (editMode) {
      const updated = shopItems.map((item) =>
        item.id === formData.id ? formData : item
      );
      setShopItems(updated);
      showToast(`${formData.name} updated successfully`, "success");
    } else {
      setShopItems([
        ...shopItems,
        { ...formData, id: `SHOP${Date.now()}` },
      ]);
      showToast(`${formData.name} added successfully`, "success");
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
