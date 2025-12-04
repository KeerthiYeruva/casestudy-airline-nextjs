'use client';

// src/slices/dataSlice.js
// Single source of truth for all shared data
import { createSlice } from '@reduxjs/toolkit';
import { 
  flights as flightData, 
  passengers as passengerData, 
  ancillaryServices,
  mealOptions,
  shopItems,
  shopCategories
} from '../data/flightData';

const initialState = {
  flights: flightData,
  passengers: passengerData,
  ancillaryServices: ancillaryServices,
  mealOptions: mealOptions,
  shopItems: shopItems,
  shopCategories: shopCategories,
};

const dataSlice = createSlice({
  name: 'data',
  initialState,
  reducers: {
    // Flight operations
    setFlights(state, action) {
      state.flights = action.payload;
    },
    
    // Passenger operations
    setPassengers(state, action) {
      state.passengers = action.payload;
    },
    addPassenger(state, action) {
      state.passengers.push(action.payload);
    },
    updatePassenger(state, action) {
      const index = state.passengers.findIndex(p => p.id === action.payload.id);
      if (index !== -1) state.passengers[index] = action.payload;
    },
    deletePassenger(state, action) {
      state.passengers = state.passengers.filter(p => p.id !== action.payload);
    },
    checkInPassenger(state, action) {
      const passenger = state.passengers.find(p => p.id === action.payload);
      if (passenger) passenger.checkedIn = true;
    },
    undoCheckIn(state, action) {
      const passenger = state.passengers.find(p => p.id === action.payload);
      if (passenger) passenger.checkedIn = false;
    },
    changeSeat(state, action) {
      const { passengerId, newSeat } = action.payload;
      const passenger = state.passengers.find(p => p.id === passengerId);
      if (passenger) {
        // Check if new seat is available
        const seatTaken = state.passengers.find(
          p => p.seat === newSeat && p.flightId === passenger.flightId && p.id !== passengerId
        );
        if (!seatTaken) {
          passenger.seat = newSeat;
        }
      }
    },
    
    // Ancillary services operations
    addAncillaryServiceToPassenger(state, action) {
      const { passengerId, service } = action.payload;
      const passenger = state.passengers.find(p => p.id === passengerId);
      if (passenger && !passenger.ancillaryServices.includes(service)) {
        passenger.ancillaryServices.push(service);
      }
    },
    removeAncillaryServiceFromPassenger(state, action) {
      const { passengerId, service } = action.payload;
      const passenger = state.passengers.find(p => p.id === passengerId);
      if (passenger) {
        passenger.ancillaryServices = passenger.ancillaryServices.filter(s => s !== service);
      }
    },
    addAncillaryService(state, action) {
      if (!state.ancillaryServices.includes(action.payload)) {
        state.ancillaryServices.push(action.payload);
      }
    },
    updateAncillaryService(state, action) {
      const { oldService, newService } = action.payload;
      const index = state.ancillaryServices.indexOf(oldService);
      if (index !== -1) {
        state.ancillaryServices[index] = newService;
        // Update all passengers using this service
        state.passengers.forEach(passenger => {
          const serviceIndex = passenger.ancillaryServices.indexOf(oldService);
          if (serviceIndex !== -1) {
            passenger.ancillaryServices[serviceIndex] = newService;
          }
        });
      }
    },
    deleteAncillaryService(state, action) {
      state.ancillaryServices = state.ancillaryServices.filter(s => s !== action.payload);
      // Remove from all passengers
      state.passengers.forEach(passenger => {
        passenger.ancillaryServices = passenger.ancillaryServices.filter(s => s !== action.payload);
      });
    },
    
    // Meal operations
    changeMealPreference(state, action) {
      const { passengerId, meal } = action.payload;
      const passenger = state.passengers.find(p => p.id === passengerId);
      if (passenger) {
        passenger.specialMeal = meal;
      }
    },
    addMealOption(state, action) {
      if (!state.mealOptions.includes(action.payload)) {
        state.mealOptions.push(action.payload);
      }
    },
    updateMealOption(state, action) {
      const { oldMeal, newMeal } = action.payload;
      const index = state.mealOptions.indexOf(oldMeal);
      if (index !== -1) {
        state.mealOptions[index] = newMeal;
        // Update all passengers using this meal
        state.passengers.forEach(passenger => {
          if (passenger.specialMeal === oldMeal) {
            passenger.specialMeal = newMeal;
          }
        });
      }
    },
    deleteMealOption(state, action) {
      state.mealOptions = state.mealOptions.filter(m => m !== action.payload);
      // Reset to 'Regular' for passengers using this meal
      state.passengers.forEach(passenger => {
        if (passenger.specialMeal === action.payload) {
          passenger.specialMeal = 'Regular';
        }
      });
    },
    
    // Shop operations
    addShopRequest(state, action) {
      const { passengerId, item, quantity, price } = action.payload;
      const passenger = state.passengers.find(p => p.id === passengerId);
      if (passenger) {
        if (!passenger.shopRequests) {
          passenger.shopRequests = [];
        }
        const existingItem = passenger.shopRequests.find(r => r.item === item);
        if (existingItem) {
          existingItem.quantity += quantity;
        } else {
          passenger.shopRequests.push({ item, quantity, price });
        }
      }
    },
    removeShopRequest(state, action) {
      const { passengerId, item } = action.payload;
      const passenger = state.passengers.find(p => p.id === passengerId);
      if (passenger && passenger.shopRequests) {
        passenger.shopRequests = passenger.shopRequests.filter(r => r.item !== item);
      }
    },
    updateShopRequestQuantity(state, action) {
      const { passengerId, item, quantity } = action.payload;
      const passenger = state.passengers.find(p => p.id === passengerId);
      if (passenger && passenger.shopRequests) {
        const request = passenger.shopRequests.find(r => r.item === item);
        if (request) {
          request.quantity = quantity;
        }
      }
    },
    addShopItem(state, action) {
      state.shopItems.push(action.payload);
    },
    updateShopItem(state, action) {
      const index = state.shopItems.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.shopItems[index] = action.payload;
      }
    },
    deleteShopItem(state, action) {
      state.shopItems = state.shopItems.filter(item => item.id !== action.payload);
    },
  },
});

export const {
  setFlights,
  setPassengers,
  addPassenger,
  updatePassenger,
  deletePassenger,
  checkInPassenger,
  undoCheckIn,
  changeSeat,
  addAncillaryServiceToPassenger,
  removeAncillaryServiceFromPassenger,
  addAncillaryService,
  updateAncillaryService,
  deleteAncillaryService,
  changeMealPreference,
  addMealOption,
  updateMealOption,
  deleteMealOption,
  addShopRequest,
  removeShopRequest,
  updateShopRequestQuantity,
  addShopItem,
  updateShopItem,
  deleteShopItem,
} = dataSlice.actions;

export default dataSlice.reducer;

