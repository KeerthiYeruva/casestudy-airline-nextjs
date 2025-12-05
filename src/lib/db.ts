// In-memory database for Next.js with TypeScript
// This simulates a database - in production, replace with actual database (MongoDB, PostgreSQL, etc.)

import { 
  flights as initialFlights, 
  passengers as initialPassengers, 
  ancillaryServices, 
  mealOptions, 
  shopItems, 
  shopCategories 
} from '@/data/flightData';
import type { Flight, Passenger, ShopItem } from '@/types';

// Use initial data directly - Zustand persist handles localStorage
let flights: Flight[] = JSON.parse(JSON.stringify(initialFlights));
let passengers: Passenger[] = JSON.parse(JSON.stringify(initialPassengers));
let services: string[] = [...ancillaryServices];
let meals: string[] = [...mealOptions];
let shop: ShopItem[] = JSON.parse(JSON.stringify(shopItems));
let categories: string[] = [...shopCategories];

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
  getAll: (): Flight[] => [...flights],
  
  getById: (id: string): Flight | undefined => flights.find(f => f.id === id),
  
  create: (flight: Partial<Flight>): Flight => {
    const newFlight: Flight = { 
      ...flight as Flight, 
      id: `FL${Date.now()}` 
    };
    flights.push(newFlight);

    return newFlight;
  },
  
  update: (id: string, updates: Partial<Flight>): Flight | null => {
    const index = flights.findIndex(f => f.id === id);
    if (index !== -1) {
      flights[index] = { ...flights[index], ...updates };
  
      return flights[index];
    }
    return null;
  },
  
  delete: (id: string): Flight | null => {
    const index = flights.findIndex(f => f.id === id);
    if (index !== -1) {
      const deleted = flights[index];
      flights.splice(index, 1);
      // Also delete associated passengers
      passengers = passengers.filter(p => p.flightId !== id);
  

      return deleted;
    }
    return null;
  },
};

// Database operations for Passengers
export const passengerDB = {
  getAll: (): Passenger[] => [...passengers],
  
  getById: (id: string): Passenger | undefined => passengers.find(p => p.id === id),
  
  getByFlightId: (flightId: string): Passenger[] => passengers.filter(p => p.flightId === flightId),
  
  create: (passenger: Partial<Passenger>): Passenger => {
    // Check if seat is already occupied on this flight
    if (passenger.seat && passenger.flightId) {
      validateSeatAvailability(passenger.seat, passenger.flightId);
    }
    
    const newPassenger: Passenger = { 
      id: `P${Date.now()}`,
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
    passengers.push(newPassenger);

    return newPassenger;
  },
  
  update: (id: string, updates: Partial<Passenger>): Passenger | null => {
    const index = passengers.findIndex(p => p.id === id);
    if (index === -1) {
      return null;
    }
    
    // If updating seat, check if it's already occupied on the same flight
    if (updates.seat) {
      const currentPassenger = passengers[index];
      const flightId = updates.flightId || currentPassenger.flightId;
      validateSeatAvailability(updates.seat, flightId, id);
    }
    
    passengers[index] = { ...passengers[index], ...updates };
    return passengers[index];
  },
  
  delete: (id: string): Passenger | null => {
    const index = passengers.findIndex(p => p.id === id);
    if (index !== -1) {
      const deleted = passengers[index];
      passengers.splice(index, 1);

      return deleted;
    }
    return null;
  },
  
  checkIn: (id: string): Passenger | null => {
    const passenger = passengers.find(p => p.id === id);
    if (passenger) {
      passenger.checkedIn = true;

      return passenger;
    }
    return null;
  },
  
  undoCheckIn: (id: string): Passenger | null => {
    const passenger = passengers.find(p => p.id === id);
    if (passenger) {
      passenger.checkedIn = false;

      return passenger;
    }
    return null;
  },
  
  changeSeat: (id: string, newSeat: string): Passenger | null => {
    const passenger = passengers.find(p => p.id === id);
    if (!passenger) {
      return null;
    }
    
    // Check if the new seat is already occupied by another passenger on the same flight
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
