// Database abstraction layer for Next.js with TypeScript
// Uses Firestore when configured, falls back to in-memory storage

import { 
  flights as initialFlights, 
  passengers as initialPassengers, 
  ancillaryServices, 
  mealOptions, 
  shopItems, 
  shopCategories 
} from '@/data/flightData';
import * as firestoreService from './firestoreService';
import type { Flight, Passenger, ShopItem } from '@/types';

// In-memory fallback storage
let flights: Flight[] = JSON.parse(JSON.stringify(initialFlights));
let passengers: Passenger[] = JSON.parse(JSON.stringify(initialPassengers));
let services: string[] = [...ancillaryServices];
let meals: string[] = [...mealOptions];
let shop: ShopItem[] = JSON.parse(JSON.stringify(shopItems));
let categories: string[] = [...shopCategories];

// Check if Firestore is available
const useFirestore = firestoreService.isFirebaseConfigured();

// Helper function to check if seat is available
function validateSeatAvailability(
  seat: string, 
  flightId: string, 
  excludePassengerId?: string
): void {
  const existingPassenger = passengers.find(p => 
    p.id !== excludePassengerId &&
    p.seat === seat && 
    p.flightId === flightId
  );
  
  if (existingPassenger) {
    throw new Error(`Seat ${seat} is already occupied by ${existingPassenger.name}`);
  }
}

// Database operations for Flights
export const flightDB = {
  getAll: async (): Promise<Flight[]> => {
    if (useFirestore) {
      return await firestoreService.getAllFlights();
    }
    return [...flights];
  },
  
  getById: async (id: string): Promise<Flight | undefined> => {
    if (useFirestore) {
      const flight = await firestoreService.getFlightById(id);
      return flight || undefined;
    }
    return flights.find(f => f.id === id);
  },
  
  create: async (flight: Partial<Flight>): Promise<Flight> => {
    if (useFirestore) {
      return await firestoreService.createFlight(flight as Omit<Flight, 'id'>);
    }
    
    const newFlight: Flight = { 
      ...flight as Flight, 
      id: `FL${Date.now()}` 
    };
    flights.push(newFlight);
    return newFlight;
  },
  
  update: async (id: string, updates: Partial<Flight>): Promise<Flight | null> => {
    if (useFirestore) {
      return await firestoreService.updateFlight(id, updates);
    }
    
    const index = flights.findIndex(f => f.id === id);
    if (index !== -1) {
      flights[index] = { ...flights[index], ...updates };
      return flights[index];
    }
    return null;
  },
  
  delete: async (id: string): Promise<Flight | null> => {
    if (useFirestore) {
      const flight = await firestoreService.getFlightById(id);
      if (flight) {
        await firestoreService.deleteFlight(id);
        // Also delete associated passengers
        const flightPassengers = await firestoreService.getAllPassengers(id);
        for (const p of flightPassengers) {
          await firestoreService.deletePassenger(p.id);
        }
        return flight;
      }
      return null;
    }
    
    const index = flights.findIndex(f => f.id === id);
    if (index !== -1) {
      const deleted = flights[index];
      flights.splice(index, 1);
      passengers = passengers.filter(p => p.flightId !== id);
      return deleted;
    }
    return null;
  },
};

// Database operations for Passengers
export const passengerDB = {
  getAll: async (flightId?: string | null): Promise<Passenger[]> => {
    if (useFirestore) {
      return await firestoreService.getAllPassengers(flightId);
    }
    return flightId ? passengers.filter(p => p.flightId === flightId) : [...passengers];
  },
  
  getById: async (id: string): Promise<Passenger | undefined> => {
    if (useFirestore) {
      const passenger = await firestoreService.getPassengerById(id);
      return passenger || undefined;
    }
    return passengers.find(p => p.id === id);
  },
  
  getByFlightId: async (flightId: string): Promise<Passenger[]> => {
    if (useFirestore) {
      return await firestoreService.getAllPassengers(flightId);
    }
    return passengers.filter(p => p.flightId === flightId);
  },
  
  create: async (passenger: Partial<Passenger>): Promise<Passenger> => {
    // Check if seat is already occupied on this flight
    if (passenger.seat && passenger.flightId) {
      const allPassengers = useFirestore 
        ? await firestoreService.getAllPassengers(passenger.flightId)
        : passengers.filter(p => p.flightId === passenger.flightId);
      
      const existing = allPassengers.find(p => p.seat === passenger.seat);
      if (existing) {
        throw new Error(`Seat ${passenger.seat} is already occupied by ${existing.name}`);
      }
    }
    
    const newPassenger: Omit<Passenger, 'id'> = { 
      name: passenger.name || '',
      seat: passenger.seat || '',
      flightId: passenger.flightId || '',
      checkedIn: false,
      wheelchair: passenger.wheelchair || false,
      infant: passenger.infant || false,
      ancillaryServices: passenger.ancillaryServices || [],
      specialMeal: passenger.specialMeal || 'Regular',
      bookingReference: passenger.bookingReference || '',
      shopRequests: passenger.shopRequests || [],
      passport: passenger.passport || { number: '', expiryDate: '', country: '' },
      address: passenger.address || '',
      dateOfBirth: passenger.dateOfBirth || '',
    };
    
    if (useFirestore) {
      return await firestoreService.createPassenger(newPassenger);
    }
    
    const created = { ...newPassenger, id: `P${Date.now()}` };
    passengers.push(created);
    return created;
  },
  
  update: async (id: string, updates: Partial<Passenger>): Promise<Passenger | null> => {
    if (useFirestore) {
      // Check seat availability if updating seat
      if (updates.seat) {
        const currentPassenger = await firestoreService.getPassengerById(id);
        if (currentPassenger) {
          const flightId = updates.flightId || currentPassenger.flightId;
          const allPassengers = await firestoreService.getAllPassengers(flightId);
          const existing = allPassengers.find(p => p.id !== id && p.seat === updates.seat);
          if (existing) {
            throw new Error(`Seat ${updates.seat} is already occupied by ${existing.name}`);
          }
        }
      }
      return await firestoreService.updatePassenger(id, updates);
    }
    
    const index = passengers.findIndex(p => p.id === id);
    if (index === -1) return null;
    
    if (updates.seat) {
      const currentPassenger = passengers[index];
      const flightId = updates.flightId || currentPassenger.flightId;
      validateSeatAvailability(updates.seat, flightId, id);
    }
    
    passengers[index] = { ...passengers[index], ...updates };
    return passengers[index];
  },
  
  delete: async (id: string): Promise<Passenger | null> => {
    if (useFirestore) {
      const passenger = await firestoreService.getPassengerById(id);
      if (passenger) {
        await firestoreService.deletePassenger(id);
        return passenger;
      }
      return null;
    }
    
    const index = passengers.findIndex(p => p.id === id);
    if (index !== -1) {
      const deleted = passengers[index];
      passengers.splice(index, 1);
      return deleted;
    }
    return null;
  },
  
  checkIn: async (id: string): Promise<Passenger | null> => {
    if (useFirestore) {
      return await firestoreService.updatePassenger(id, { checkedIn: true });
    }
    
    const passenger = passengers.find(p => p.id === id);
    if (passenger) {
      passenger.checkedIn = true;
      return passenger;
    }
    return null;
  },
  
  undoCheckIn: async (id: string): Promise<Passenger | null> => {
    if (useFirestore) {
      return await firestoreService.updatePassenger(id, { checkedIn: false });
    }
    
    const passenger = passengers.find(p => p.id === id);
    if (passenger) {
      passenger.checkedIn = false;
      return passenger;
    }
    return null;
  },
  
  changeSeat: async (id: string, newSeat: string): Promise<Passenger | null> => {
    if (useFirestore) {
      const passenger = await firestoreService.getPassengerById(id);
      if (!passenger) return null;
      
      // Check if seat is available
      const allPassengers = await firestoreService.getAllPassengers(passenger.flightId);
      const existing = allPassengers.find(p => p.id !== id && p.seat === newSeat);
      if (existing) {
        throw new Error(`Seat ${newSeat} is already occupied by ${existing.name}`);
      }
      
      return await firestoreService.updatePassenger(id, { seat: newSeat });
    }
    
    const passenger = passengers.find(p => p.id === id);
    if (!passenger) return null;
    
    validateSeatAvailability(newSeat, passenger.flightId, id);
    passenger.seat = newSeat;
    return passenger;
  },
};

// Database operations for Services
export const serviceDB = {
  getAll: (): string[] => [...services],
  add: (service: string): void => {
    if (!services.includes(service)) {
      services.push(service);
    }
  },
  remove: (service: string): void => {
    services = services.filter(s => s !== service);
  },
};

// Database operations for Meals
export const mealDB = {
  getAll: (): string[] => [...meals],
  add: (meal: string): void => {
    if (!meals.includes(meal)) {
      meals.push(meal);

    }
  },
  remove: (meal: string): void => {
    meals = meals.filter(m => m !== meal);

  },
};

// Database operations for Shop Items
export const shopDB = {
  getAll: (): ShopItem[] => [...shop],
  getById: (id: string): ShopItem | undefined => shop.find((item) => item.id === id),
  getByCategory: (category: string): ShopItem[] => shop.filter((item) => item.category === category),
  add: (item: ShopItem): ShopItem => {
    shop.push(item);

    return item;
  },
  update: (id: string, updates: Partial<ShopItem>): ShopItem | null => {
    const index = shop.findIndex((item) => item.id === id);
    if (index !== -1) {
      shop[index] = { ...shop[index], ...updates };
  
      return shop[index];
    }
    return null;
  },
  delete: (id: string): ShopItem | null => {
    const index = shop.findIndex((item) => item.id === id);
    if (index !== -1) {
      const deleted = shop[index];
      shop.splice(index, 1);
  
      return deleted;
    }
    return null;
  },
};

// Database operations for Shop Categories
export const categoryDB = {
  getAll: (): string[] => [...categories],
  add: (category: string): void => {
    if (!categories.includes(category)) {
      categories.push(category);

    }
  },
  remove: (category: string): void => {
    categories = categories.filter(c => c !== category);

  },
};

// Reset database to initial state
export const resetDatabase = () => {
  // Reload initial data
  flights = JSON.parse(JSON.stringify(initialFlights));
  passengers = JSON.parse(JSON.stringify(initialPassengers));
  services = [...ancillaryServices];
  meals = [...mealOptions];
  shop = JSON.parse(JSON.stringify(shopItems));
  categories = [...shopCategories];
};
