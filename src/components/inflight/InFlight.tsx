"use client";

import React, { useState, useEffect ,useRef} from "react";
import useCheckInStore from "@/stores/useCheckInStore";
import useDataStore from "@/stores/useDataStore";
import useToastStore from "@/stores/useToastStore";
import useRealtimeUpdates from "@/hooks/useRealtimeUpdates";
import CabinSeatMapDialog from "@/components/seats/CabinSeatMapDialog";
import InFlightFlightList from "@/components/inflight/InFlightFlightList";
import InFlightPassengerList from "@/components/inflight/InFlightPassengerList";
import PassengerServicePanel from "@/components/inflight/PassengerServicePanel";
import AddServiceDialog from "@/components/inflight/AddServiceDialog";
import ChangeMealDialog from "@/components/inflight/ChangeMealDialog";
import ShopDialog from "@/components/inflight/ShopDialog";
import FlightInfoGrid from "@/components/ui/FlightInfoGrid";
import PageHeader from "@/components/ui/PageHeader";
import type { Passenger } from "@/types/passenger";
import type { ShopItem } from "@/types/services";
import {
  shopCategories as shopCategoriesData,
} from "@/data/flightData";
import { Box, Button, Container, Paper, Typography, Grid } from "@mui/material";
import "@/styles/InFlight.scss";

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
  const [seatMapDialog, setSeatMapDialog] = useState(false);
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

  useEffect(() => {
    if (!selectedFlight || flightPassengers.length === 0) {
      setSelectedPassenger(null);
      return;
    }

    const selectedPassengerStillOnFlight = selectedPassenger
      ? flightPassengers.some((passenger) => passenger.id === selectedPassenger.id)
      : false;

    if (!selectedPassengerStillOnFlight) {
      setSelectedPassenger(flightPassengers[0]);
    }
  }, [selectedFlight, passengers, selectedPassenger]);

  const handleFlightSelect = (flight: (typeof flights)[0]) => {
    selectFlight(flight);
  };

  const handleSeatClick = (seat: string) => {
    const passenger = flightPassengers.find((p) => p.seat === seat);
    if (passenger) {
      setSelectedPassenger(passenger);
      setSeatMapDialog(false);
    }
  };

  const handlePassengerSelect = (passenger: Passenger) => {
    setSelectedPassenger(passenger);
  };

  // Derive the current passenger data from the passengers array
  // This ensures we always show the latest data without setState in effect
  const currentPassengerData = selectedPassenger 
    ? passengers.find((p) => p.id === selectedPassenger.id) || selectedPassenger
    : null;

  const availableServices = ancillaryServices.filter(
    (service) => !currentPassengerData?.ancillaryServices.includes(service)
  );

  const handleAddService = async () => {
    if (!selectedPassenger || !selectedService) {
      showToast("Please select a passenger and service", "warning");
      return;
    }
    await addAncillaryServiceToPassenger(selectedPassenger.id, selectedService);
    showToast(`${selectedService} added for ${selectedPassenger.name}`, "success");
    setAddServiceDialog(false);
    setSelectedService("");
    await fetchPassengers();
  };

  const handleRemoveService = async (service: string) => {
    if (selectedPassenger) {
      await removeAncillaryServiceFromPassenger(selectedPassenger.id, service);
      showToast(`${service} removed`, "info");
      await fetchPassengers();
    }
  };

  const handleChangeMeal = async () => {
    if (!selectedPassenger || !selectedMeal) {
      showToast("Please select a meal option", "warning");
      return;
    }
    await changeMealPreference(selectedPassenger.id, selectedMeal);
    showToast(`Meal changed to ${selectedMeal} for ${selectedPassenger.name}`, "success");
    setChangeMealDialog(false);
    setSelectedMeal("");
    await fetchPassengers();
  };

  const handleAddShopItem = async () => {
    if (!selectedPassenger || !selectedShopItem) {
      showToast("Please select a passenger and shop item", "warning");
      return;
    }
    if (!shopQuantity || shopQuantity <= 0) {
      showToast("Quantity must be at least 1", "warning");
      return;
    }
    await addShopRequest(
      selectedPassenger.id,
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
    if (selectedPassenger) {
      await removeShopRequest(selectedPassenger.id, item);
      showToast(`${item} removed from cart`, "info");
      await fetchPassengers();
    }
  };

  const handleUpdateQuantity = async (itemName: string, newQuantity: number) => {
    if (selectedPassenger && newQuantity > 0) {
      const passenger = passengers.find((p) => p.id === selectedPassenger.id);
      if (passenger && passenger.shopRequests) {
        const updatedRequests = passenger.shopRequests.map((r) =>
          r.itemName === itemName ? { ...r, quantity: newQuantity } : r
        );
        await updatePassenger(selectedPassenger.id, {
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
    <Container maxWidth={false} sx={{ py: { xs: 2, sm: 3 }, px: { xs: 2, md: 0 }, minWidth: 0 }}>
      <PageHeader
        title="In-Flight Services"
        isConnected={isConnected}
        selectedFlightNumber={selectedFlight?.flightNumber}
      />

      <Grid container spacing={{ xs: 2, sm: 3, xl: 4 }} sx={{ minWidth: 0 }}>
        <Grid size={{ xs: 12, md: 3 }} sx={{ minWidth: 0 }}>
          <InFlightFlightList
            flights={flights}
            selectedFlightId={selectedFlight?.id}
            onFlightSelect={handleFlightSelect}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 9 }} sx={{ minWidth: 0 }}>
          {selectedFlight ? (
            <>
              <FlightInfoGrid flight={selectedFlight} />

              <Grid container spacing={{ xs: 2, xl: 3 }} sx={{ minWidth: 0 }}>
                <Grid size={{ xs: 12, lg: 4 }} sx={{ minWidth: 0 }}>
                  <InFlightPassengerList
                    passengers={flightPassengers}
                    selectedPassengerId={selectedPassenger?.id}
                    onPassengerSelect={handlePassengerSelect}
                  />
                </Grid>

                <Grid size={{ xs: 12, lg: 8 }} sx={{ minWidth: 0 }}>
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
                </Grid>
              </Grid>

              <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                <Button variant="outlined" onClick={() => setSeatMapDialog(true)}>
                  View Seat Map
                </Button>
              </Box>

            </>
          ) : (
            <Paper elevation={3} sx={{ p: 4, textAlign: "center" }}>
              <Typography variant="h6" color="textSecondary">
                Please select a flight to view in-flight services
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>

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

      <CabinSeatMapDialog
        open={seatMapDialog}
        passengers={flightPassengers}
        onClose={() => setSeatMapDialog(false)}
        onSeatSelect={handleSeatClick}
      />
    </Container>
  );
};

export default InFlight;
