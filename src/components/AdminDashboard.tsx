"use client";

import React, { useState, useEffect } from "react";
import useAdminStore from "@/stores/useAdminStore";
import useDataStore from "@/stores/useDataStore";
import useToastStore from "@/stores/useToastStore";
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
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import SettingsIcon from "@mui/icons-material/Settings";

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

  useEffect(() => {
    fetchFlights();
    fetchPassengers();
  }, [fetchFlights, fetchPassengers]);

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
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
          <SettingsIcon color="primary" />
          <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
            Admin Dashboard
          </Typography>
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
              return !!result;
            }}
            onDeletePassenger={async (id) => {
              const result = await deletePassenger(id);
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
    </Container>
  );
};

export default AdminDashboard;
// @ts-nocheck
