import type { Flight } from '../../domain/flights/types';
import type { Passenger } from '../../domain/passengers/types';
import type { FamilySeating, GroupSeating, PremiumSeatUpsell, SeatPreferences } from '../../domain/seats/types';
import type { ShopItem } from '../../domain/services/types';

export interface DataState {
  flights: Flight[];
  passengers: Passenger[];
  ancillaryServices: string[];
  mealOptions: string[];
  shopItems: ShopItem[];
  shopCategories: string[];
  loading: boolean;
  error: string | null;
}

export interface FilterOptions {
  checkedIn?: boolean | null;
  wheelchair?: boolean;
  infant?: boolean;
  missingPassport?: boolean;
  missingAddress?: boolean;
  missingDOB?: boolean;
}

export interface CheckInState {
  selectedFlight: Flight | null;
  filterOptions: FilterOptions;
}

export interface AdminState {
  selectedFlight: Flight | null;
  filterOptions: FilterOptions;
}

export interface ToastState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export interface DataActions {
  fetchFlights: () => Promise<void>;
  fetchPassengers: (flightId?: string | null) => Promise<void>;
  setFlights: (flights: Flight[]) => void;
  setPassengers: (passengers: Passenger[]) => void;
  addFlight: (flight: Partial<Flight>) => Promise<Flight | null>;
  updateFlight: (id: string, updates: Partial<Flight>) => Promise<Flight | null>;
  deleteFlight: (id: string) => Promise<Flight | null>;
  addPassenger: (passenger: Partial<Passenger>) => Promise<Passenger | null>;
  updatePassenger: (id: string, updates: Partial<Passenger>) => Promise<Passenger | null>;
  deletePassenger: (id: string) => Promise<Passenger | null>;
  checkInPassenger: (id: string) => Promise<Passenger | null>;
  undoCheckIn: (id: string) => Promise<Passenger | null>;
  changeSeat: (id: string, newSeat: string) => Promise<Passenger | null>;
  fetchCatalog: () => Promise<void>;
  addAncillaryService: (service: string) => Promise<string | null>;
  updateAncillaryService: (oldService: string, newService: string) => Promise<string | null>;
  deleteAncillaryService: (service: string) => Promise<string | null>;
  addMealOption: (meal: string) => Promise<string | null>;
  updateMealOption: (oldMeal: string, newMeal: string) => Promise<string | null>;
  deleteMealOption: (meal: string) => Promise<string | null>;
  addShopItem: (item: ShopItem) => Promise<ShopItem | null>;
  updateShopItem: (id: string, updates: Partial<ShopItem>) => Promise<ShopItem | null>;
  deleteShopItem: (id: string) => Promise<ShopItem | null>;
  setAncillaryServices: (services: string[]) => void;
  setMealOptions: (meals: string[]) => void;
  setShopItems: (items: ShopItem[]) => void;
  setShopCategories: (categories: string[]) => void;
  resetToInitialData: () => Promise<void>;
  addAncillaryServiceToPassenger: (passengerId: string, service: string) => Promise<void>;
  removeAncillaryServiceFromPassenger: (passengerId: string, service: string) => Promise<void>;
  changeMealPreference: (passengerId: string, meal: string) => Promise<void>;
  addShopRequest: (passengerId: string, itemName: string, quantity: number, price: number) => Promise<void>;
  removeShopRequest: (passengerId: string, itemName: string) => Promise<void>;
  updateSeatPreferences: (passengerId: string, preferences: SeatPreferences) => Promise<void>;
  allocateGroupSeating: (groupSeating: GroupSeating, passengerIds: string[]) => Promise<void>;
  allocateFamilySeating: (familySeating: FamilySeating, passengerIds: string[]) => Promise<void>;
  upgradeToPremium: (passengerId: string, seatNumber: string) => Promise<void>;
  getPremiumSeatUpsells: (flightId: string) => PremiumSeatUpsell[];
}

export interface CheckInActions {
  selectFlight: (flight: Flight | null) => void;
  setFilter: (updates: Partial<FilterOptions>) => void;
  clearFilters: () => void;
}

export interface AdminActions {
  selectFlight: (flight: Flight | null) => void;
  setAdminFilter: (updates: Partial<FilterOptions>) => void;
  clearAdminFilters: () => void;
}

export interface ToastActions {
  showToast: (message: string, severity?: 'success' | 'error' | 'warning' | 'info') => void;
  hideToast: () => void;
}

export type DataStore = DataState & DataActions;
export type CheckInStore = CheckInState & CheckInActions;
export type AdminStore = AdminState & AdminActions;
export type ToastStore = ToastState & ToastActions;
