// In-memory database for Next.js
// This simulates a database - in production, replace with actual database (MongoDB, PostgreSQL, etc.)

import { flights as initialFlights, passengers as initialPassengers, ancillaryServices, mealOptions, shopItems, shopCategories } from '@/data/flightData';

// Deep clone initial data
let flights = JSON.parse(JSON.stringify(initialFlights));
let passengers = JSON.parse(JSON.stringify(initialPassengers));
let services = [...ancillaryServices];
let meals = [...mealOptions];
let shop = JSON.parse(JSON.stringify(shopItems));
let categories = [...shopCategories];

// Database operations for Flights
export const flightDB = {
  getAll: () => [...flights],
  
  getById: (id) => flights.find(f => f.id === id),
  
  create: (flight) => {
    const newFlight = { ...flight, id: `FL${Date.now()}` };
    flights.push(newFlight);
    return newFlight;
  },
  
  update: (id, updates) => {
    const index = flights.findIndex(f => f.id === id);
    if (index !== -1) {
      flights[index] = { ...flights[index], ...updates };
      return flights[index];
    }
    return null;
  },
  
  delete: (id) => {
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
  getAll: () => [...passengers],
  
  getById: (id) => passengers.find(p => p.id === id),
  
  getByFlightId: (flightId) => passengers.filter(p => p.flightId === flightId),
  
  create: (passenger) => {
    const newPassenger = { 
      ...passenger, 
      id: `P${Date.now()}`,
      checkedIn: false,
      ancillaryServices: passenger.ancillaryServices || [],
      shopRequests: passenger.shopRequests || [],
    };
    passengers.push(newPassenger);
    return newPassenger;
  },
  
  update: (id, updates) => {
    const index = passengers.findIndex(p => p.id === id);
    if (index !== -1) {
      passengers[index] = { ...passengers[index], ...updates };
      return passengers[index];
    }
    return null;
  },
  
  delete: (id) => {
    const index = passengers.findIndex(p => p.id === id);
    if (index !== -1) {
      const deleted = passengers[index];
      passengers.splice(index, 1);
      return deleted;
    }
    return null;
  },
  
  checkIn: (id) => {
    const passenger = passengers.find(p => p.id === id);
    if (passenger) {
      passenger.checkedIn = true;
      return passenger;
    }
    return null;
  },
  
  undoCheckIn: (id) => {
    const passenger = passengers.find(p => p.id === id);
    if (passenger) {
      passenger.checkedIn = false;
      return passenger;
    }
    return null;
  },
  
  changeSeat: (id, newSeat) => {
    const passenger = passengers.find(p => p.id === id);
    if (passenger) {
      // Check if seat is already taken
      const seatTaken = passengers.find(
        p => p.seat === newSeat && p.flightId === passenger.flightId && p.id !== id
      );
      if (!seatTaken) {
        passenger.seat = newSeat;
        return passenger;
      }
      return { error: 'Seat already taken' };
    }
    return null;
  },
};

// Database operations for Ancillary Services
export const serviceDB = {
  getAll: () => [...services],
  
  create: (service) => {
    if (!services.includes(service)) {
      services.push(service);
      return service;
    }
    return null;
  },
  
  update: (oldService, newService) => {
    const index = services.indexOf(oldService);
    if (index !== -1) {
      services[index] = newService;
      // Update in all passengers
      passengers.forEach(passenger => {
        const serviceIndex = passenger.ancillaryServices.indexOf(oldService);
        if (serviceIndex !== -1) {
          passenger.ancillaryServices[serviceIndex] = newService;
        }
      });
      return newService;
    }
    return null;
  },
  
  delete: (service) => {
    const index = services.indexOf(service);
    if (index !== -1) {
      services.splice(index, 1);
      // Remove from all passengers
      passengers.forEach(passenger => {
        passenger.ancillaryServices = passenger.ancillaryServices.filter(s => s !== service);
      });
      return service;
    }
    return null;
  },
};

// Database operations for Meals
export const mealDB = {
  getAll: () => [...meals],
  
  create: (meal) => {
    if (!meals.includes(meal)) {
      meals.push(meal);
      return meal;
    }
    return null;
  },
  
  update: (oldMeal, newMeal) => {
    const index = meals.indexOf(oldMeal);
    if (index !== -1) {
      meals[index] = newMeal;
      // Update in all passengers
      passengers.forEach(passenger => {
        if (passenger.specialMeal === oldMeal) {
          passenger.specialMeal = newMeal;
        }
      });
      return newMeal;
    }
    return null;
  },
  
  delete: (meal) => {
    const index = meals.indexOf(meal);
    if (index !== -1) {
      meals.splice(index, 1);
      // Reset to 'Regular' for passengers using this meal
      passengers.forEach(passenger => {
        if (passenger.specialMeal === meal) {
          passenger.specialMeal = 'Regular';
        }
      });
      return meal;
    }
    return null;
  },
};

// Database operations for Shop Items
export const shopDB = {
  getAll: () => [...shop],
  
  getById: (id) => shop.find(item => item.id === id),
  
  create: (item) => {
    const newItem = { ...item, id: `SHOP${Date.now()}` };
    shop.push(newItem);
    return newItem;
  },
  
  update: (id, updates) => {
    const index = shop.findIndex(item => item.id === id);
    if (index !== -1) {
      shop[index] = { ...shop[index], ...updates };
      return shop[index];
    }
    return null;
  },
  
  delete: (id) => {
    const index = shop.findIndex(item => item.id === id);
    if (index !== -1) {
      const deleted = shop[index];
      shop.splice(index, 1);
      return deleted;
    }
    return null;
  },
};

// Reset database to initial state (useful for testing)
export const resetDB = () => {
  flights = JSON.parse(JSON.stringify(initialFlights));
  passengers = JSON.parse(JSON.stringify(initialPassengers));
  services = [...ancillaryServices];
  meals = [...mealOptions];
  shop = JSON.parse(JSON.stringify(shopItems));
  categories = [...shopCategories];
};
