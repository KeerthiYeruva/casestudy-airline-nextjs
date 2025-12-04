'use client';

// Zustand store for data management with API integration
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useDataStore = create(
  devtools(
    (set, get) => ({
      // State
      flights: [],
      passengers: [],
      ancillaryServices: [],
      mealOptions: [],
      shopItems: [],
      shopCategories: [],
      loading: false,
      error: null,

      // Fetch all data from API
      fetchFlights: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/flights');
          const result = await response.json();
          if (result.success) {
            set({ flights: result.data, loading: false });
          } else {
            set({ error: result.error, loading: false });
          }
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      fetchPassengers: async (flightId = null) => {
        set({ loading: true, error: null });
        try {
          const url = flightId ? `/api/passengers?flightId=${flightId}` : '/api/passengers';
          const response = await fetch(url);
          const result = await response.json();
          if (result.success) {
            set({ passengers: result.data, loading: false });
          } else {
            set({ error: result.error, loading: false });
          }
        } catch (error) {
          set({ error: error.message, loading: false });
        }
      },

      // Flight CRUD operations
      addFlight: async (flight) => {
        try {
          const response = await fetch('/api/flights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(flight),
          });
          const result = await response.json();
          if (result.success) {
            set((state) => ({ flights: [...state.flights, result.data] }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error.message });
          return null;
        }
      },

      updateFlight: async (id, updates) => {
        try {
          const response = await fetch(`/api/flights/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          });
          const result = await response.json();
          if (result.success) {
            set((state) => ({
              flights: state.flights.map((f) => (f.id === id ? result.data : f)),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error.message });
          return null;
        }
      },

      deleteFlight: async (id) => {
        try {
          const response = await fetch(`/api/flights/${id}`, {
            method: 'DELETE',
          });
          const result = await response.json();
          if (result.success) {
            set((state) => ({
              flights: state.flights.filter((f) => f.id !== id),
              passengers: state.passengers.filter((p) => p.flightId !== id),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error.message });
          return null;
        }
      },

      // Passenger CRUD operations
      addPassenger: async (passenger) => {
        try {
          const response = await fetch('/api/passengers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(passenger),
          });
          const result = await response.json();
          if (result.success) {
            set((state) => ({ passengers: [...state.passengers, result.data] }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error.message });
          return null;
        }
      },

      updatePassenger: async (id, updates) => {
        try {
          const response = await fetch(`/api/passengers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          });
          const result = await response.json();
          if (result.success) {
            set((state) => ({
              passengers: state.passengers.map((p) => (p.id === id ? result.data : p)),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error.message });
          return null;
        }
      },

      deletePassenger: async (id) => {
        try {
          const response = await fetch(`/api/passengers/${id}`, {
            method: 'DELETE',
          });
          const result = await response.json();
          if (result.success) {
            set((state) => ({
              passengers: state.passengers.filter((p) => p.id !== id),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error.message });
          return null;
        }
      },

      // Check-in operations
      checkInPassenger: async (id) => {
        try {
          const response = await fetch(`/api/passengers/${id}/checkin`, {
            method: 'POST',
          });
          const result = await response.json();
          if (result.success) {
            set((state) => ({
              passengers: state.passengers.map((p) => (p.id === id ? result.data : p)),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error.message });
          return null;
        }
      },

      undoCheckIn: async (id) => {
        try {
          const response = await fetch(`/api/passengers/${id}/checkin`, {
            method: 'DELETE',
          });
          const result = await response.json();
          if (result.success) {
            set((state) => ({
              passengers: state.passengers.map((p) => (p.id === id ? result.data : p)),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error.message });
          return null;
        }
      },

      // Seat change
      changeSeat: async (passengerId, newSeat) => {
        try {
          const response = await fetch(`/api/passengers/${passengerId}/seat`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seat: newSeat }),
          });
          const result = await response.json();
          if (result.success) {
            set((state) => ({
              passengers: state.passengers.map((p) => (p.id === passengerId ? result.data : p)),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error.message });
          return null;
        }
      },

      // Local state management for services and meals (can be extended with API calls)
      setAncillaryServices: (services) => set({ ancillaryServices: services }),
      setMealOptions: (meals) => set({ mealOptions: meals }),
      setShopItems: (items) => set({ shopItems: items }),
      setShopCategories: (categories) => set({ shopCategories: categories }),

      // Ancillary services for passengers (local updates + API call)
      addAncillaryServiceToPassenger: async (passengerId, service) => {
        const passenger = get().passengers.find((p) => p.id === passengerId);
        if (passenger && !passenger.ancillaryServices.includes(service)) {
          const updatedServices = [...passenger.ancillaryServices, service];
          await get().updatePassenger(passengerId, { ancillaryServices: updatedServices });
        }
      },

      removeAncillaryServiceFromPassenger: async (passengerId, service) => {
        const passenger = get().passengers.find((p) => p.id === passengerId);
        if (passenger) {
          const updatedServices = passenger.ancillaryServices.filter((s) => s !== service);
          await get().updatePassenger(passengerId, { ancillaryServices: updatedServices });
        }
      },

      // Meal preference
      changeMealPreference: async (passengerId, meal) => {
        await get().updatePassenger(passengerId, { specialMeal: meal });
      },

      // Shop requests
      addShopRequest: async (passengerId, item, quantity, price) => {
        const passenger = get().passengers.find((p) => p.id === passengerId);
        if (passenger) {
          const shopRequests = passenger.shopRequests || [];
          const existingItem = shopRequests.find((r) => r.item === item);
          
          let updatedRequests;
          if (existingItem) {
            updatedRequests = shopRequests.map((r) =>
              r.item === item ? { ...r, quantity: r.quantity + quantity } : r
            );
          } else {
            updatedRequests = [...shopRequests, { item, quantity, price }];
          }
          
          await get().updatePassenger(passengerId, { shopRequests: updatedRequests });
        }
      },

      removeShopRequest: async (passengerId, item) => {
        const passenger = get().passengers.find((p) => p.id === passengerId);
        if (passenger && passenger.shopRequests) {
          const updatedRequests = passenger.shopRequests.filter((r) => r.item !== item);
          await get().updatePassenger(passengerId, { shopRequests: updatedRequests });
        }
      },

      clearError: () => set({ error: null }),
    }),
    { name: 'DataStore' }
  )
);

export default useDataStore;
