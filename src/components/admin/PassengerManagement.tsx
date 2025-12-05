"use client";

import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { Passenger, Flight } from "@/types";
import PassengerFilters from "./PassengerFilters";
import PassengerTable from "./PassengerTable";
import PassengerDialog from "./PassengerDialog";
import ConfirmDialog from "../ConfirmDialog";
import useToastStore from "@/stores/useToastStore";

interface FilterOptions {
  missingPassport: boolean;
  missingAddress: boolean;
  missingDOB: boolean;
}

interface PassengerFormData extends Omit<Passenger, "id"> {
  id: string;
}

interface PassengerManagementProps {
  passengers: Passenger[];
  flights: Flight[];
  selectedFlightId: string;
  onFlightSelect: (flightId: string) => void;
  filterOptions: FilterOptions;
  onFilterChange: (filter: Partial<FilterOptions>) => void;
  onClearFilters: () => void;
  onResetData: () => void;
  dataStoreError: string | null;
  onAddPassenger: (passenger: PassengerFormData) => Promise<boolean>;
  onUpdatePassenger: (id: string, passenger: PassengerFormData) => Promise<boolean>;
  onDeletePassenger: (id: string) => Promise<boolean>;
}

interface ConfirmDialogState {
  open: boolean;
  title?: string;
  message: string;
  severity?: "info" | "error" | "warning" | "success";
  onConfirm: () => void;
}

const PassengerManagement: React.FC<PassengerManagementProps> = ({
  passengers,
  flights,
  selectedFlightId,
  onFlightSelect,
  filterOptions,
  onFilterChange,
  onClearFilters,
  onResetData,
  dataStoreError,
  onAddPassenger,
  onUpdatePassenger,
  onDeletePassenger,
}) => {
  const { showToast } = useToastStore();
  const [searchQuery, setSearchQuery] = useState("");
  const [passengerDialog, setPassengerDialog] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState<ConfirmDialogState>({
    open: false,
    message: "",
    onConfirm: () => {},
  });

  const [passengerForm, setPassengerForm] = useState<PassengerFormData>({
    id: "",
    name: "",
    seat: "",
    flightId: "",
    passport: { number: "", expiryDate: "", country: "" },
    address: "",
    dateOfBirth: "",
    ancillaryServices: [],
    specialMeal: "Regular",
    wheelchair: false,
    infant: false,
    checkedIn: false,
    bookingReference: "",
    shopRequests: [],
  });

  // Helper function to apply passenger filters
  const applyPassengerFilters = (passenger: Passenger): boolean => {
    if (filterOptions.missingPassport && passenger.passport?.number?.trim()) {
      return false;
    }
    if (filterOptions.missingAddress && passenger.address?.trim()) {
      return false;
    }
    if (filterOptions.missingDOB && passenger.dateOfBirth?.trim()) {
      return false;
    }
    if (
      searchQuery &&
      !passenger.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }
    return true;
  };

  // Filter passengers
  const filteredPassengers = selectedFlightId
    ? passengers.filter(
        (p) => p.flightId === selectedFlightId && applyPassengerFilters(p)
      )
    : passengers.filter(applyPassengerFilters);

  const handleOpenPassengerDialog = (passenger: Passenger | null = null) => {
    if (passenger) {
      setEditMode(true);
      const services = passenger.ancillaryServices || [];
      const hasWheelchairService = services.includes("Wheelchair Assistance");
      const hasInfantService = services.includes("Infant Care Kit");

      setPassengerForm({
        ...passenger,
        passport: passenger.passport || {
          number: "",
          expiryDate: "",
          country: "",
        },
        address: passenger.address || "",
        dateOfBirth: passenger.dateOfBirth || "",
        ancillaryServices: services,
        specialMeal: passenger.specialMeal || "Regular",
        wheelchair: passenger.wheelchair || hasWheelchairService,
        infant: passenger.infant || hasInfantService,
        checkedIn: passenger.checkedIn || false,
        bookingReference: passenger.bookingReference || "",
        shopRequests: passenger.shopRequests || [],
      });
    } else {
      setEditMode(false);
      const selectedFlight = flights.find((f) => f.id === selectedFlightId);
      const timestamp = Date.now().toString();
      const bookingRef = `BKG${timestamp.slice(-7)}`;
      setPassengerForm({
        id: `P${timestamp}`,
        name: "",
        seat: "",
        flightId: selectedFlight?.id || "",
        passport: { number: "", expiryDate: "", country: "" },
        address: "",
        dateOfBirth: "",
        ancillaryServices: [],
        specialMeal: "Regular",
        wheelchair: false,
        infant: false,
        checkedIn: false,
        bookingReference: bookingRef,
        shopRequests: [],
      });
    }
    setPassengerDialog(true);
  };

  const handleSavePassenger = async () => {
    // Validation is now handled in the dialog component
    if (editMode) {
      const result = await onUpdatePassenger(passengerForm.id, passengerForm);
      if (result) {
        showToast(
          `Passenger ${passengerForm.name} updated successfully`,
          "success"
        );
        setPassengerDialog(false);
      } else {
        // Show the actual error message from the API
        const errorMsg = dataStoreError || "Update failed. Please check all fields and try again.";
        showToast(errorMsg, "error");
      }
    } else {
      const result = await onAddPassenger(passengerForm);
      if (result) {
        showToast(
          `Passenger ${passengerForm.name} added successfully`,
          "success"
        );
        setPassengerDialog(false);
      } else {
        // Show the actual error message from the API
        const errorMsg = dataStoreError || "Add failed. Please check all fields and try again.";
        showToast(errorMsg, "error");
      }
    }
  };

  const handleDeletePassenger = (id: string) => {
    const passenger = passengers.find((p) => p.id === id);
    setConfirmDialog({
      open: true,
      title: "Delete Passenger",
      message: `Are you sure you want to delete ${
        passenger?.name || "this passenger"
      }?`,
      severity: "error",
      onConfirm: async () => {
        const result = await onDeletePassenger(id);
        if (result) {
          showToast(
            `Passenger ${passenger?.name || id} deleted successfully`,
            "success"
          );
        } else {
          showToast("Delete failed", "error");
        }
      },
    });
  };

  const handleResetData = async () => {
    if (
      window.confirm(
        "This will reset all data to initial state from flightData.ts. Continue?"
      )
    ) {
      await onResetData();
      showToast("Data reset to initial state", "success");
    }
  };

  return (
    <>
      <PassengerFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedFlightId={selectedFlightId}
        onFlightSelect={onFlightSelect}
        flights={flights}
        filterOptions={filterOptions}
        onFilterChange={onFilterChange}
        onClearFilters={onClearFilters}
        onResetData={handleResetData}
      />

      <Box
        sx={{
          mb: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6">
          Passengers ({filteredPassengers.length})
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenPassengerDialog()}
        >
          Add Passenger
        </Button>
      </Box>

      <PassengerTable
        passengers={filteredPassengers}
        flights={flights}
        onEdit={handleOpenPassengerDialog}
        onDelete={handleDeletePassenger}
      />

      <PassengerDialog
        open={passengerDialog}
        onClose={() => setPassengerDialog(false)}
        editMode={editMode}
        passengerForm={passengerForm}
        onFormChange={setPassengerForm}
        onSave={handleSavePassenger}
        flights={flights}
        allPassengers={passengers}
      />

      <ConfirmDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={confirmDialog.onConfirm}
        title={confirmDialog.title}
        message={confirmDialog.message}
        severity={confirmDialog.severity}
      />
    </>
  );
};

export default PassengerManagement;
