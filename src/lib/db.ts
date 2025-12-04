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
import type { Flight, Passenger } from '@/types';

// Helper to check if we're in browser environment
const isBrowser = typeof window !== 'undefined';

// Helper functions for localStorage persistence
const saveToStorage = (key: string, data: any) => {
  if (isBrowser) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.error('Failed to save to localStorage:', e);
    }
  }
};

const loadFromStorage = <T>(key: string, fallback: T): T => {
  if (isBrowser) {
    try {
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : fallback;
    } catch (e) {
      console.error('Failed to load from localStorage:', e);
      return fallback;
    }
  }
  return fallback;
};

// Load data from localStorage or use initial data
let flights: Flight[] = loadFromStorage('flights', JSON.parse(JSON.stringify(initialFlights)));
let passengers: Passenger[] = loadFromStorage('passengers', JSON.parse(JSON.stringify(initialPassengers)));
let services: string[] = loadFromStorage('services', [...ancillaryServices]);
let meals: string[] = loadFromStorage('meals', [...mealOptions]);
let shop = loadFromStorage('shop', JSON.parse(JSON.stringify(shopItems)));
let categories: string[] = loadFromStorage('categories', [...shopCategories]);

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
    saveToStorage('flights', flights);
    return newFlight;
  },
  
  update: (id: string, updates: Partial<Flight>): Flight | null => {
    const index = flights.findIndex(f => f.id === id);
    if (index !== -1) {
      flights[index] = { ...flights[index], ...updates };
      saveToStorage('flights', flights);
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
      saveToStorage('flights', flights);
      saveToStorage('passengers', passengers);
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
    saveToStorage('passengers', passengers);
    return newPassenger;
  },
  
  update: (id: string, updates: Partial<Passenger>): Passenger | null => {
    const index = passengers.findIndex(p => p.id === id);
    if (index !== -1) {
      passengers[index] = { ...passengers[index], ...updates };
      saveToStorage('passengers', passengers);
      return passengers[index];
    }
    return null;
  },
  
  delete: (id: string): Passenger | null => {
    const index = passengers.findIndex(p => p.id === id);
    if (index !== -1) {
      const deleted = passengers[index];
      passengers.splice(index, 1);
      saveToStorage('passengers', passengers);
      return deleted;
    }
    return null;
  },
  
  checkIn: (id: string): Passenger | null => {
    const passenger = passengers.find(p => p.id === id);
    if (passenger) {
      passenger.checkedIn = true;
      saveToStorage('passengers', passengers);
      return passenger;
    }
    return null;
  },
  
  undoCheckIn: (id: string): Passenger | null => {
    const passenger = passengers.find(p => p.id === id);
    if (passenger) {
      passenger.checkedIn = false;
      saveToStorage('passengers', passengers);
      return passenger;
    }
    return null;
  },
  
  changeSeat: (id: string, newSeat: string): Passenger | null => {
    const passenger = passengers.find(p => p.id === id);
    if (passenger) {
      passenger.seat = newSeat;
      saveToStorage('passengers', passengers);
      return passenger;
    }
    return null;
  },
};

// Database operations for Services
export const serviceDB = {
  getAll: (): string[] => [...services],
  add: (service: string): void => {
    if (!services.includes(service)) {
      services.push(service);
      saveToStorage('services', services);
    }
  },
  remove: (service: string): void => {
    services = services.filter(s => s !== service);
    saveToStorage('services', services);
  },
};

// Database operations for Meals
export const mealDB = {
  getAll: (): string[] => [...meals],
  add: (meal: string): void => {
    if (!meals.includes(meal)) {
      meals.push(meal);
      saveToStorage('meals', meals);
    }
  },
  remove: (meal: string): void => {
    meals = meals.filter(m => m !== meal);
    saveToStorage('meals', meals);
  },
};

// Database operations for Shop Items
export const shopDB = {
  getAll: () => [...shop],
  getById: (id: string) => shop.find((item: any) => item.id === id),
  getByCategory: (category: string) => shop.filter((item: any) => item.category === category),
  add: (item: any) => {
    shop.push(item);
    saveToStorage('shop', shop);
    return item;
  },
  update: (id: string, updates: any) => {
    const index = shop.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      shop[index] = { ...shop[index], ...updates };
      saveToStorage('shop', shop);
      return shop[index];
    }
    return null;
  },
  delete: (id: string) => {
    const index = shop.findIndex((item: any) => item.id === id);
    if (index !== -1) {
      const deleted = shop[index];
      shop.splice(index, 1);
      saveToStorage('shop', shop);
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
      saveToStorage('categories', categories);
    }
  },
  remove: (category: string): void => {
    categories = categories.filter(c => c !== category);
    saveToStorage('categories', categories);
  },
};

// Reset database to initial state (clears localStorage)
export const resetDatabase = () => {
  if (isBrowser) {
    localStorage.removeItem('flights');
    localStorage.removeItem('passengers');
    localStorage.removeItem('services');
    localStorage.removeItem('meals');
    localStorage.removeItem('shop');
    localStorage.removeItem('categories');
    
    // Reload initial data
    flights = JSON.parse(JSON.stringify(initialFlights));
    passengers = JSON.parse(JSON.stringify(initialPassengers));
    services = [...ancillaryServices];
    meals = [...mealOptions];
    shop = JSON.parse(JSON.stringify(shopItems));
    categories = [...shopCategories];
  }
};
