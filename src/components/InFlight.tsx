"use client";

import React, { useState, useEffect } from "react";
import useCheckInStore from "@/stores/useCheckInStore";
import useDataStore from "@/stores/useDataStore";
import useToastStore from "@/stores/useToastStore";
import SeatMapVisual from "./SeatMapVisual";
import InFlightFlightList from "./inflight/InFlightFlightList";
import InFlightPassengerList from "./inflight/InFlightPassengerList";
import PassengerServicePanel from "./inflight/PassengerServicePanel";
import AddServiceDialog from "./inflight/AddServiceDialog";
import ChangeMealDialog from "./inflight/ChangeMealDialog";
import ShopDialog from "./inflight/ShopDialog";
import { Passenger, ShopItem } from "@/types";
import {
  shopItems as shopItemsData,
  shopCategories as shopCategoriesData,
  ancillaryServices as ancillaryServicesData,
  mealOptions as mealOptionsData,
} from "@/data/flightData";
import { Container, Paper, Typography, Grid, Box, Chip } from "@mui/material";
import "../styles/InFlight.scss";

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
    addAncillaryServiceToPassenger,
    removeAncillaryServiceFromPassenger,
    changeMealPreference,
    addShopRequest,
    removeShopRequest,
    updatePassenger,
    setShopItems,
    setShopCategories,
    setAncillaryServices,
    setMealOptions,
  } = useDataStore();
  const { selectedFlight, selectFlight } = useCheckInStore();
  const { showToast } = useToastStore();

  useEffect(() => {
    fetchFlights();
    fetchPassengers();
    setShopItems(shopItemsData);
    setShopCategories(shopCategoriesData);
    setAncillaryServices(ancillaryServicesData);
    setMealOptions(mealOptionsData);
  }, [
    fetchFlights,
    fetchPassengers,
    setShopItems,
    setShopCategories,
    setAncillaryServices,
    setMealOptions,
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

  const flightPassengers = selectedFlight
    ? passengers.filter((p) => p.flightId === selectedFlight.id)
    : [];

  const handleFlightSelect = (flight: (typeof flights)[0]) => {
    selectFlight(flight);
    setSelectedPassenger(null);
  };

  const handleSeatClick = (seat: string) => {
    const passenger = flightPassengers.find((p) => p.seat === seat);
    if (passenger) {
      setSelectedPassenger(passenger);
    }
  };

  const refreshSelectedPassenger = () => {
    if (selectedPassenger) {
      setTimeout(() => {
        const updated = passengers.find((p) => p.id === selectedPassenger.id);
        if (updated) setSelectedPassenger(updated);
      }, 100);
    }
  };

  const availableServices = ancillaryServices.filter(
    (service) => !selectedPassenger?.ancillaryServices.includes(service)
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
    refreshSelectedPassenger();
  };

  const handleRemoveService = async (service: string) => {
    if (selectedPassenger) {
      await removeAncillaryServiceFromPassenger(selectedPassenger.id, service);
      showToast(`${service} removed`, "info");
      refreshSelectedPassenger();
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
    refreshSelectedPassenger();
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
    refreshSelectedPassenger();
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
    <Container maxWidth="xl" sx={{ py: { xs: 2, sm: 3 } }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <Typography variant="h4" sx={{ fontSize: { xs: '1.5rem', sm: '2rem' } }}>
          In-Flight Services
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
        <Grid size={{ xs: 12, md: 3 }}>
          <InFlightFlightList
            flights={flights}
            selectedFlightId={selectedFlight?.id}
            onFlightSelect={handleFlightSelect}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 9 }}>
          {selectedFlight ? (
            <>
              <Paper elevation={3} className="flight-details" sx={{ mb: 2, p: 2 }}>
                <Typography variant="h5" gutterBottom>
                  {selectedFlight.name}
                </Typography>
                <Grid container spacing={2}>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="textSecondary">Time</Typography>
                    <Typography variant="body1">{selectedFlight.time}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="textSecondary">Route</Typography>
                    <Typography variant="body1">{selectedFlight.from} → {selectedFlight.to}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="textSecondary">Gate</Typography>
                    <Typography variant="body1">{selectedFlight.gate}</Typography>
                  </Grid>
                  <Grid size={{ xs: 6, sm: 3 }}>
                    <Typography variant="body2" color="textSecondary">Status</Typography>
                    <Typography variant="body1">{selectedFlight.status}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, lg: 7 }}>
                  <SeatMapVisual
                    passengers={flightPassengers}
                    onSeatClick={handleSeatClick}
                    mode="inflight"
                  />
                </Grid>

                <Grid size={{ xs: 12, lg: 5 }}>
                  <InFlightPassengerList
                    passengers={flightPassengers}
                    selectedPassengerId={selectedPassenger?.id}
                    onPassengerSelect={setSelectedPassenger}
                  />
                </Grid>
              </Grid>

              {selectedPassenger && (
                <PassengerServicePanel
                  passenger={selectedPassenger}
                  onAddService={() => setAddServiceDialog(true)}
                  onRemoveService={handleRemoveService}
                  onChangeMeal={() => {
                    setSelectedMeal(selectedPassenger.specialMeal);
                    setChangeMealDialog(true);
                  }}
                  onAddShopItem={() => setShopDialog(true)}
                  onRemoveShopItem={handleRemoveShopItem}
                  onUpdateQuantity={handleUpdateQuantity}
                  calculateShopTotal={calculateShopTotal}
                />
              )}
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

      {selectedPassenger && (
        <>
          <ChangeMealDialog
            open={changeMealDialog}
            currentMeal={selectedPassenger.specialMeal}
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
    </Container>
  );
};

export default InFlight;
