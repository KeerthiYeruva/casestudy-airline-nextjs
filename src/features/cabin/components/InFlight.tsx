"use client";

import React, { useState, useEffect ,useRef} from "react";
import useCheckInStore from "../../../stores/useCheckInStore";
import useDataStore from "../../../stores/useDataStore";
import useToastStore from "../../../stores/useToastStore";
import useRealtimeUpdates from "../../../hooks/useRealtimeUpdates";
import InFlightFlightList from "./InFlightFlightList";
import InFlightPassengerList from "./InFlightPassengerList";
import PassengerServicePanel from "./PassengerServicePanel";
import AddServiceDialog from "./AddServiceDialog";
import ChangeMealDialog from "./ChangeMealDialog";
import ShopDialog from "./ShopDialog";
import OperationalWorkspace from "../../../shared/components/layout/OperationalWorkspace";
import type { Passenger } from "../../../domain/passengers/types";
import type { ShopItem } from "../../../domain/services/types";
import {
  shopCategories as shopCategoriesData,
} from "../../../domain/fixtures/flightData";
import { Paper, Typography, Box } from "@mui/material";

const InFlight: React.FC = () => {
  const {
    flights,
    passengers,
    ancillaryServices,
    mealOptions,
    shopItems,
    shopCategories,
    fetchFlights,
    fetchPassengers,
    fetchCatalog,
    addAncillaryServiceToPassenger,
    removeAncillaryServiceFromPassenger,
    changeMealPreference,
    addShopRequest,
    removeShopRequest,
    updatePassenger,
    setShopCategories,
  } = useDataStore();
  const { selectedFlight, selectFlight } = useCheckInStore();
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

      if (shopCategories.length === 0) {
        setShopCategories(shopCategoriesData);
      }
      hasFetchedRef.current = true;
    }
  }, [
    flights.length,
    passengers.length,
    shopItems.length,
    shopCategories.length,
    ancillaryServices.length,
    mealOptions.length,
    fetchFlights,
    fetchPassengers,
    fetchCatalog,
    setShopCategories,
  ]);

  const [selectedPassenger, setSelectedPassenger] = useState<Passenger | null>(null);
  const [addServiceDialog, setAddServiceDialog] = useState(false);
  const [changeMealDialog, setChangeMealDialog] = useState(false);
  const [shopDialog, setShopDialog] = useState(false);
  const [selectedService, setSelectedService] = useState("");
  const [selectedMeal, setSelectedMeal] = useState("");
  const [selectedShopItem, setSelectedShopItem] = useState<ShopItem | null>(null);
  const [shopQuantity, setShopQuantity] = useState(1);
  const [shopCategory, setShopCategory] = useState("All");

  useEffect(() => {
    if (selectedFlight || flights.length === 0) {
      return;
    }

    const defaultFlight =
      flights.find((flight) => flight.status === "Boarding") ??
      flights.find((flight) => flight.status === "On Time") ??
      flights[0];

    selectFlight(defaultFlight);
  }, [flights, selectFlight, selectedFlight]);

  const flightPassengers = selectedFlight
    ? passengers.filter((p) => p.flightId === selectedFlight.id)
    : [];
  const selectedPassengerOnFlight = selectedPassenger
    ? flightPassengers.find((passenger) => passenger.id === selectedPassenger.id)
    : null;
  const currentPassengerData = selectedPassengerOnFlight
    ? passengers.find((passenger) => passenger.id === selectedPassengerOnFlight.id) || selectedPassengerOnFlight
    : flightPassengers[0] ?? null;

  const handleFlightSelect = (flight: (typeof flights)[0]) => {
    selectFlight(flight);
    setSelectedPassenger(null);
  };

  const handlePassengerSelect = (passenger: Passenger) => {
    setSelectedPassenger(passenger);
  };

  const availableServices = ancillaryServices.filter(
    (service) => !currentPassengerData?.ancillaryServices.includes(service)
  );

  const handleAddService = async () => {
    if (!currentPassengerData || !selectedService) {
      showToast("Please select a passenger and service", "warning");
      return;
    }
    await addAncillaryServiceToPassenger(currentPassengerData.id, selectedService);
    showToast(`${selectedService} added for ${currentPassengerData.name}`, "success");
    setAddServiceDialog(false);
    setSelectedService("");
    await fetchPassengers();
  };

  const handleRemoveService = async (service: string) => {
    if (currentPassengerData) {
      await removeAncillaryServiceFromPassenger(currentPassengerData.id, service);
      showToast(`${service} removed`, "info");
      await fetchPassengers();
    }
  };

  const handleChangeMeal = async () => {
    if (!currentPassengerData || !selectedMeal) {
      showToast("Please select a meal option", "warning");
      return;
    }
    await changeMealPreference(currentPassengerData.id, selectedMeal);
    showToast(`Meal changed to ${selectedMeal} for ${currentPassengerData.name}`, "success");
    setChangeMealDialog(false);
    setSelectedMeal("");
    await fetchPassengers();
  };

  const handleAddShopItem = async () => {
    if (!currentPassengerData || !selectedShopItem) {
      showToast("Please select a passenger and shop item", "warning");
      return;
    }
    if (!shopQuantity || shopQuantity <= 0) {
      showToast("Quantity must be at least 1", "warning");
      return;
    }
    await addShopRequest(
      currentPassengerData.id,
      selectedShopItem.name,
      shopQuantity,
      selectedShopItem.price
    );
    showToast(`${selectedShopItem.name} (x${shopQuantity}) added to cart`, "success");
    handleCloseShopDialog();
    await fetchPassengers();
  };

  const handleCloseShopDialog = () => {
    setShopDialog(false);
    setSelectedShopItem(null);
    setShopQuantity(1);
    setShopCategory("All");
  };

  const handleRemoveShopItem = async (item: string) => {
    if (currentPassengerData) {
      await removeShopRequest(currentPassengerData.id, item);
      showToast(`${item} removed from cart`, "info");
      await fetchPassengers();
    }
  };

  const handleUpdateQuantity = async (itemName: string, newQuantity: number) => {
    if (currentPassengerData && newQuantity > 0) {
      const passenger = passengers.find((p) => p.id === currentPassengerData.id);
      if (passenger && passenger.shopRequests) {
        const updatedRequests = passenger.shopRequests.map((r) =>
          r.itemName === itemName ? { ...r, quantity: newQuantity } : r
        );
        await updatePassenger(currentPassengerData.id, {
          shopRequests: updatedRequests,
        });
        await fetchPassengers();
      }
    }
  };

  const filteredShopItems =
    shopCategory === "All"
      ? shopItems
      : shopItems.filter((item) => item.category === shopCategory);

  const calculateShopTotal = (shopRequests: Passenger["shopRequests"]) => {
    if (!shopRequests || shopRequests.length === 0) return 0;
    return shopRequests.reduce((total, request) => {
      const price = Number(request.price) || 0;
      const quantity = Number(request.quantity) || 0;
      return total + price * quantity;
    }, 0);
  };

  return (
    <OperationalWorkspace
      className="inflight"
      title="In-Flight Services"
      isConnected={isConnected}
      selectedFlight={selectedFlight}
      operationalPassengers={flightPassengers}
      leftRail={(
        <InFlightFlightList
          flights={flights}
          selectedFlightId={selectedFlight?.id}
          onFlightSelect={handleFlightSelect}
        />
      )}
      rightRail={selectedFlight && (
        <Paper elevation={3} sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box>
            <Typography variant="h6">Passenger Manifest</Typography>
            <Typography variant="body2" color="text.secondary">
              Select by seat and booking reference; use Seat Ops for visual cabin lookup.
            </Typography>
          </Box>
          <InFlightPassengerList
            passengers={flightPassengers}
            selectedPassengerId={currentPassengerData?.id}
            onPassengerSelect={handlePassengerSelect}
            embedded
          />
        </Paper>
      )}
      rightRailWidth={{ lg: 3.25, xl: 3 }}
      emptyState={(
        <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="h6" color="textSecondary">
            Please select a flight to view in-flight services
          </Typography>
        </Paper>
      )}
    >
      {currentPassengerData ? (
        <PassengerServicePanel
          passenger={currentPassengerData}
          onAddService={() => setAddServiceDialog(true)}
          onRemoveService={handleRemoveService}
          onChangeMeal={() => {
            setSelectedMeal(currentPassengerData.specialMeal);
            setChangeMealDialog(true);
          }}
          onAddShopItem={() => setShopDialog(true)}
          onRemoveShopItem={handleRemoveShopItem}
          onUpdateQuantity={handleUpdateQuantity}
          calculateShopTotal={calculateShopTotal}
        />
      ) : (
        <Paper elevation={3} sx={{ p: { xs: 3, sm: 4 }, height: "100%", display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            Select a passenger to view meals, services, and shop requests.
          </Typography>
        </Paper>
      )}

      <AddServiceDialog
        open={addServiceDialog}
        availableServices={availableServices}
        selectedService={selectedService}
        onServiceChange={setSelectedService}
        onClose={() => setAddServiceDialog(false)}
        onConfirm={handleAddService}
      />

      {currentPassengerData && (
        <>
          <ChangeMealDialog
            open={changeMealDialog}
            currentMeal={currentPassengerData.specialMeal}
            mealOptions={mealOptions}
            selectedMeal={selectedMeal}
            onMealChange={setSelectedMeal}
            onClose={() => setChangeMealDialog(false)}
            onConfirm={handleChangeMeal}
          />

          <ShopDialog
            open={shopDialog}
            shopCategories={shopCategories}
            shopCategory={shopCategory}
            filteredShopItems={filteredShopItems}
            selectedShopItem={selectedShopItem}
            shopQuantity={shopQuantity}
            onCategoryChange={setShopCategory}
            onItemSelect={setSelectedShopItem}
            onQuantityChange={setShopQuantity}
            onClose={handleCloseShopDialog}
            onConfirm={handleAddShopItem}
          />

        </>
      )}

    </OperationalWorkspace>
  );
};

export default InFlight;
