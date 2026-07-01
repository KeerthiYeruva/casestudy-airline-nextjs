'use client';

// Zustand store for data management with API integration
// 
// AUTOMATIC REACTIVITY:
// - All components subscribed to this store automatically re-render when state changes
// - Every action (add, update, delete) immediately updates Zustand state
// - Zustand persist middleware automatically syncs to localStorage
// - No manual useEffect needed in components - just use the store!
// 
// USAGE EXAMPLE:
// const { passengers, addPassenger } = useDataStore();
// await addPassenger(newData); // ← All components update instantly!

import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { APIResponse } from '@/types/api';
import type { Flight } from '@/types/flight';
import type { Passenger } from '@/types/passenger';
import type { FamilySeating, GroupSeating, SeatPreferences } from '@/types/seat';
import type { AncillaryService, MealOption, ShopCategory, ShopItem } from '@/types/services';
import type { DataStore } from '@/types/store';
import { 
  flights as initialFlights,
  passengers as initialPassengers,
  ancillaryServices as defaultAncillaryServices,
  mealOptions as defaultMealOptions,
  shopItems as defaultShopItems,
  shopCategories as defaultShopCategories
} from '@/data/flightData';

// Version for auto-sync detection
const DATA_VERSION = 1;

const useDataStore = create<DataStore>()(
  devtools(
    persist(
      (set, _get) => ({
        // State
        flights: [],
        passengers: [],
        ancillaryServices: defaultAncillaryServices,
        mealOptions: defaultMealOptions,
        shopItems: defaultShopItems,
        shopCategories: defaultShopCategories,
        loading: false,
        error: null,

      // Direct setters for Firestore real-time sync
      setFlights: (flights: Flight[]) => set({ flights }),
      setPassengers: (passengers: Passenger[]) => set({ passengers }),

      // Fetch all data from API
      fetchFlights: async () => {
        set({ loading: true, error: null });
        try {
          const response = await fetch('/api/flights');
          const result: APIResponse<Flight[]> = await response.json();
          if (result.success && result.data) {
            set({ flights: result.data, loading: false });
            // Zustand persist automatically saves to localStorage
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
            // Zustand persist automatically saves to localStorage
          } else {
            set({ error: result.error || 'Failed to fetch passengers', loading: false });
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
      },

      fetchCatalog: async () => {
        try {
          const [servicesResponse, mealsResponse, shopResponse] = await Promise.all([
            fetch('/api/services'),
            fetch('/api/meals'),
            fetch('/api/shop'),
          ]);

          const servicesResult: APIResponse<AncillaryService[]> = await servicesResponse.json();
          const mealsResult: APIResponse<MealOption[]> = await mealsResponse.json();
          const shopResult: APIResponse<ShopItem[]> = await shopResponse.json();

          set({
            ancillaryServices: servicesResult.success && servicesResult.data ? servicesResult.data : _get().ancillaryServices,
            mealOptions: mealsResult.success && mealsResult.data ? mealsResult.data : _get().mealOptions,
            shopItems: shopResult.success && shopResult.data ? shopResult.data : _get().shopItems,
          });
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
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
          // Store the error message from API
          const errorMsg = result.error || 'Failed to add passenger';
          set({ error: errorMsg });
          return null;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          set({ error: errorMsg });
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
          // Store the error message from API
          const errorMsg = result.error || 'Failed to update passenger';
          set({ error: errorMsg });
          return null;
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : 'Unknown error';
          set({ error: errorMsg });
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

      addAncillaryService: async (service: string) => {
        try {
          const response = await fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ service }),
          });
          const result: APIResponse<string> = await response.json();
          if (result.success && result.data) {
            set((state) => ({ ancillaryServices: Array.from(new Set([...state.ancillaryServices, result.data!])) }));
            return result.data;
          }
          set({ error: result.error || 'Failed to add service' });
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      updateAncillaryService: async (oldService: string, newService: string) => {
        try {
          const response = await fetch('/api/services', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldService, newService }),
          });
          const result: APIResponse<string> = await response.json();
          if (result.success && result.data) {
            set((state) => ({ ancillaryServices: state.ancillaryServices.map((service) => (service === oldService ? result.data! : service)) }));
            return result.data;
          }
          set({ error: result.error || 'Failed to update service' });
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      deleteAncillaryService: async (service: string) => {
        try {
          const response = await fetch('/api/services', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ service }),
          });
          const result: APIResponse<string> = await response.json();
          if (result.success && result.data) {
            set((state) => ({ ancillaryServices: state.ancillaryServices.filter((item) => item !== service) }));
            return result.data;
          }
          set({ error: result.error || 'Failed to delete service' });
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      addMealOption: async (meal: string) => {
        try {
          const response = await fetch('/api/meals', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ meal }),
          });
          const result: APIResponse<string> = await response.json();
          if (result.success && result.data) {
            set((state) => ({ mealOptions: Array.from(new Set([...state.mealOptions, result.data!])) }));
            return result.data;
          }
          set({ error: result.error || 'Failed to add meal option' });
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      updateMealOption: async (oldMeal: string, newMeal: string) => {
        try {
          const response = await fetch('/api/meals', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ oldMeal, newMeal }),
          });
          const result: APIResponse<string> = await response.json();
          if (result.success && result.data) {
            set((state) => ({ mealOptions: state.mealOptions.map((meal) => (meal === oldMeal ? result.data! : meal)) }));
            return result.data;
          }
          set({ error: result.error || 'Failed to update meal option' });
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      deleteMealOption: async (meal: string) => {
        try {
          const response = await fetch('/api/meals', {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ meal }),
          });
          const result: APIResponse<string> = await response.json();
          if (result.success && result.data) {
            set((state) => ({ mealOptions: state.mealOptions.filter((item) => item !== meal) }));
            return result.data;
          }
          set({ error: result.error || 'Failed to delete meal option' });
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      addShopItem: async (item: ShopItem) => {
        try {
          const response = await fetch('/api/shop', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(item),
          });
          const result: APIResponse<ShopItem> = await response.json();
          if (result.success && result.data) {
            set((state) => ({ shopItems: [...state.shopItems, result.data!] }));
            return result.data;
          }
          set({ error: result.error || 'Failed to add shop item' });
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      updateShopItem: async (id: string, updates: Partial<ShopItem>) => {
        try {
          const response = await fetch(`/api/shop/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updates),
          });
          const result: APIResponse<ShopItem> = await response.json();
          if (result.success && result.data) {
            set((state) => ({ shopItems: state.shopItems.map((item) => (item.id === id ? result.data! : item)) }));
            return result.data;
          }
          set({ error: result.error || 'Failed to update shop item' });
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      deleteShopItem: async (id: string) => {
        try {
          const response = await fetch(`/api/shop/${id}`, { method: 'DELETE' });
          const result: APIResponse<ShopItem> = await response.json();
          if (result.success && result.data) {
            set((state) => ({ shopItems: state.shopItems.filter((item) => item.id !== id) }));
            return result.data;
          }
          set({ error: result.error || 'Failed to delete shop item' });
          return null;
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error' });
          return null;
        }
      },

      // Reset to initial data from flightData.ts
      resetToInitialData: async () => {
        set({ loading: true });
        try {
          // Call API to reset database
          const response = await fetch('/api/reset', { method: 'POST' });
          if (response.ok) {
            // Clear Zustand persist storage and reload from source
            localStorage.removeItem('airline-data-storage');
            
            // Set data directly from source
            set({
              flights: initialFlights,
              passengers: initialPassengers,
              ancillaryServices: defaultAncillaryServices,
              mealOptions: defaultMealOptions,
              shopItems: defaultShopItems,
              shopCategories: defaultShopCategories,
              loading: false
            });
          } else {
            set({ error: 'Failed to reset data', loading: false });
          }
        } catch (error) {
          set({ error: error instanceof Error ? error.message : 'Unknown error', loading: false });
        }
      },

      // Ancillary services management
      addAncillaryServiceToPassenger: async (passengerId: string, service: string) => {
        const state = _get();
        const passenger = state.passengers.find(p => p.id === passengerId);
        if (passenger) {
          // Check if service already exists to prevent duplicates
          if (!passenger.ancillaryServices.includes(service)) {
            const updatedServices = [...(passenger.ancillaryServices || []), service];
            await state.updatePassenger(passengerId, { ancillaryServices: updatedServices });
          }
        }
      },

      removeAncillaryServiceFromPassenger: async (passengerId: string, service: string) => {
        const state = _get();
        const passenger = state.passengers.find(p => p.id === passengerId);
        if (passenger) {
          const updatedServices = passenger.ancillaryServices.filter(s => s !== service);
          const updates: Partial<Passenger> = { ancillaryServices: updatedServices };
          
          // Also update related flags when removing special services
          if (service === 'Infant Care Kit') {
            updates.infant = false;
          } else if (service === 'Wheelchair Assistance') {
            updates.wheelchair = false;
          }
          
          await state.updatePassenger(passengerId, updates);
        }
      },

      // Meal preference management
      changeMealPreference: async (passengerId: string, meal: string) => {
        const state = _get();
        await state.updatePassenger(passengerId, { specialMeal: meal });
      },

      // Shop request management
      addShopRequest: async (passengerId: string, itemName: string, quantity: number, price: number) => {
        const state = _get();
        const passenger = state.passengers.find(p => p.id === passengerId);
        if (passenger) {
          const existingRequests = passenger.shopRequests || [];
          const existingItem = existingRequests.find(r => r.itemName === itemName);
          
          let updatedRequests;
          if (existingItem) {
            // Update quantity if item already exists
            updatedRequests = existingRequests.map(r =>
              r.itemName === itemName ? { ...r, quantity: r.quantity + quantity } : r
            );
          } else {
            // Add new item - need to find the shop item for full details
            const shopItem = state.shopItems.find(item => item.name === itemName);
            if (shopItem) {
              updatedRequests = [...existingRequests, { 
                itemId: shopItem.id,
                itemName: shopItem.name,
                category: shopItem.category,
                quantity, 
                price,
                currency: shopItem.currency
              }];
            } else {
              return; // Shop item not found
            }
          }
          
          await state.updatePassenger(passengerId, { shopRequests: updatedRequests });
        }
      },

      removeShopRequest: async (passengerId: string, itemName: string) => {
        const state = _get();
        const passenger = state.passengers.find(p => p.id === passengerId);
        if (passenger && passenger.shopRequests) {
          const updatedRequests = passenger.shopRequests.filter(r => r.itemName !== itemName);
          await state.updatePassenger(passengerId, { shopRequests: updatedRequests });
        }
      },

      // Advanced Seat Management Actions
      updateSeatPreferences: async (passengerId: string, preferences: SeatPreferences) => {
        const state = _get();
        await state.updatePassenger(passengerId, { seatPreferences: preferences });
      },

      allocateGroupSeating: async (groupSeating: GroupSeating, passengerIds: string[]) => {
        const state = _get();
        // Update all passengers in the group
        for (const passengerId of passengerIds) {
          await state.updatePassenger(passengerId, { groupSeating });
        }
      },

      allocateFamilySeating: async (familySeating: FamilySeating, passengerIds: string[]) => {
        const state = _get();
        // Update all passengers in the family
        for (const passengerId of passengerIds) {
          await state.updatePassenger(passengerId, { familySeating });
        }
      },

      upgradeToPremium: async (passengerId: string, seatNumber: string) => {
        const state = _get();
        await state.updatePassenger(passengerId, { 
          seat: seatNumber,
          premiumUpgrade: true 
        });
      },

      getPremiumSeatUpsells: (flightId: string) => {
        const state = _get();
        const flight = state.flights.find(f => f.id === flightId);
        const passengers = state.passengers.filter(p => p.flightId === flightId);
        
        if (!flight || !flight.premiumSeats) return [];

        // Generate premium seat upsell offers
        return flight.premiumSeats.map(seatNumber => {
          const isOccupied = passengers.some(p => p.seat === seatNumber);
          
          return {
            seatNumber,
            basePrice: 150,
            upgradePrice: 75,
            currency: 'USD',
            features: [
              'Extra Legroom',
              'Priority Boarding',
              'Enhanced Recline',
              'Power Outlets'
            ],
            available: !isOccupied
          };
        });
      },
      }),
      {
        name: 'airline-data-storage',
        version: DATA_VERSION,
        partialize: (state) => ({
          flights: state.flights,
          passengers: state.passengers,
          ancillaryServices: state.ancillaryServices,
          mealOptions: state.mealOptions,
          shopItems: state.shopItems,
          shopCategories: state.shopCategories,
        }),
        onRehydrateStorage: () => (state) => {
          if (state) {
            state.flights = Array.isArray(state.flights) && state.flights.length > 0 ? state.flights : initialFlights;
            state.passengers = Array.isArray(state.passengers) && state.passengers.length > 0 ? state.passengers : initialPassengers;
            state.ancillaryServices = Array.isArray(state.ancillaryServices) && state.ancillaryServices.length > 0 ? state.ancillaryServices : defaultAncillaryServices;
            state.mealOptions = Array.isArray(state.mealOptions) && state.mealOptions.length > 0 ? state.mealOptions : defaultMealOptions;
            state.shopItems = Array.isArray(state.shopItems) && state.shopItems.length > 0 ? state.shopItems : defaultShopItems;
            state.shopCategories = Array.isArray(state.shopCategories) && state.shopCategories.length > 0 ? state.shopCategories : defaultShopCategories;
          }
        },
      }
    ),
    { name: 'DataStore' }
  )
);

export default useDataStore;
