'use client';

// Zustand store for data management with API integration
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { 
  DataStore, 
  Flight, 
  Passenger, 
  AncillaryService, 
  MealOption, 
  ShopItem, 
  ShopCategory,
  APIResponse 
} from '@/types';

const useDataStore = create<DataStore>()(
  devtools(
    (set, _get) => ({
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
          const result: APIResponse<Flight[]> = await response.json();
          if (result.success && result.data) {
            set({ flights: result.data, loading: false });
          } else {
            set({ error: result.error || 'Failed to fetch flights', loading: false });
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
      },

      fetchPassengers: async (flightId: string | null = null) => {
        set({ loading: true, error: null });
        try {
          const url = flightId ? `/api/passengers?flightId=${flightId}` : '/api/passengers';
          const response = await fetch(url);
          const result: APIResponse<Passenger[]> = await response.json();
          if (result.success && result.data) {
            set({ passengers: result.data, loading: false });
          } else {
            set({ error: result.error || 'Failed to fetch passengers', loading: false });
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
      },

      // Flight CRUD operations
      addFlight: async (flight: Partial<Flight>) => {
        try {
          const response = await fetch('/api/flights', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(flight),
          });
          const result: APIResponse<Flight> = await response.json();
          if (result.success && result.data) {
            set((state) => ({ flights: [...state.flights, result.data!] }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      updateFlight: async (id: string, updates: Partial<Flight>) => {
        try {
          const response = await fetch(`/api/flights/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          });
          const result: APIResponse<Flight> = await response.json();
          if (result.success && result.data) {
            set((state) => ({
              flights: state.flights.map((f) => (f.id === id ? result.data! : f)),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      deleteFlight: async (id: string) => {
        try {
          const response = await fetch(`/api/flights/${id}`, {
            method: 'DELETE',
          });
          const result: APIResponse<Flight> = await response.json();
          if (result.success && result.data) {
            set((state) => ({
              flights: state.flights.filter((f) => f.id !== id),
              passengers: state.passengers.filter((p) => p.flightId !== id),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      // Passenger CRUD operations
      addPassenger: async (passenger: Partial<Passenger>) => {
        try {
          const response = await fetch('/api/passengers', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(passenger),
          });
          const result: APIResponse<Passenger> = await response.json();
          if (result.success && result.data) {
            set((state) => ({ passengers: [...state.passengers, result.data!] }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      updatePassenger: async (id: string, updates: Partial<Passenger>) => {
        try {
          const response = await fetch(`/api/passengers/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          });
          const result: APIResponse<Passenger> = await response.json();
          if (result.success && result.data) {
            set((state) => ({
              passengers: state.passengers.map((p) => (p.id === id ? result.data! : p)),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      deletePassenger: async (id: string) => {
        try {
          const response = await fetch(`/api/passengers/${id}`, {
            method: 'DELETE',
          });
          const result: APIResponse<Passenger> = await response.json();
          if (result.success && result.data) {
            set((state) => ({
              passengers: state.passengers.filter((p) => p.id !== id),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      // Check-in operations
      checkInPassenger: async (id: string) => {
        try {
          const response = await fetch(`/api/passengers/${id}/checkin`, {
            method: 'POST',
          });
          const result: APIResponse<Passenger> = await response.json();
          if (result.success && result.data) {
            set((state) => ({
              passengers: state.passengers.map((p) => (p.id === id ? result.data! : p)),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      undoCheckIn: async (id: string) => {
        try {
          const response = await fetch(`/api/passengers/${id}/checkin`, {
            method: 'DELETE',
          });
          const result: APIResponse<Passenger> = await response.json();
          if (result.success && result.data) {
            set((state) => ({
              passengers: state.passengers.map((p) => (p.id === id ? result.data! : p)),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      // Seat change
      changeSeat: async (passengerId: string, newSeat: string) => {
        try {
          const response = await fetch(`/api/passengers/${passengerId}/seat`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ seat: newSeat }),
          });
          const result: APIResponse<Passenger> = await response.json();
          if (result.success && result.data) {
            set((state) => ({
              passengers: state.passengers.map((p) => (p.id === passengerId ? result.data! : p)),
            }));
            return result.data;
          }
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      // Local state management for services and meals
      setAncillaryServices: (services: AncillaryService[]) => set({ ancillaryServices: services }),
      setMealOptions: (meals: MealOption[]) => set({ mealOptions: meals }),
      setShopItems: (items: ShopItem[]) => set({ shopItems: items }),
      setShopCategories: (categories: ShopCategory[]) => set({ shopCategories: categories }),
    }),
    { name: 'DataStore' }
  )
);

export default useDataStore;
