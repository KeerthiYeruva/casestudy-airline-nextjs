// TypeScript type definitions for the Airline Management System

// ============ User & Authentication ============
export interface User {
  uid?: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  role?: 'admin' | 'staff';
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: 'admin' | 'staff' | null;
  loading: boolean;
  error: string | null;
}

// ============ Passenger & Flight ============
export interface Passport {
  number: string;
  expiryDate: string;
  country: string;
}

export interface ShopRequest {
  itemId: string;
  itemName: string;
  category: string;
  price: number;
  quantity: number;
  currency: string;
}

// ============ Seat Management ============
export type SeatPreference = 'window' | 'aisle' | 'middle' | 'front' | 'back' | 'exitRow';
export type SeatType = 'standard' | 'premium' | 'exit' | 'bulkhead';

export interface SeatPreferences {
  position?: SeatPreference[];
  type?: SeatType;
  nearFamily?: boolean;
}

export interface GroupSeating {
  groupId: string;
  size: number;
  keepTogether: boolean;
  leadPassengerId: string;
}

export interface FamilySeating {
  familyId: string;
  adults: number;
  children: number;
  infants: number;
  autoAllocate: boolean;
}

export interface PremiumSeatUpsell {
  seatNumber: string;
  basePrice: number;
  upgradePrice: number;
  currency: string;
  features: string[];
  available: boolean;
}

export interface Passenger {
  id: string;
  name: string;
  seat: string;
  flightId: string;
  passport?: Passport;
  address?: string;
  dateOfBirth?: string;
  ancillaryServices: string[];
  specialMeal: string;
  wheelchair: boolean;
  infant: boolean;
  checkedIn: boolean;
  bookingReference: string;
  shopRequests: ShopRequest[];
  seatPreferences?: SeatPreferences;
  groupSeating?: GroupSeating;
  familySeating?: FamilySeating;
  premiumUpgrade?: boolean;
}

export interface SeatMap {
  seatNumber: string;
  type: SeatType;
  available: boolean;
  premium: boolean;
  price?: number;
}

export interface Flight {
  id: string;
  name?: string; // Legacy property for backward compatibility
  flightNumber: string;
  origin: string;
  destination: string;
  from?: string; // Legacy property (same as origin)
  to?: string; // Legacy property (same as destination)
  departureTime: string;
  arrivalTime: string;
  time?: string; // Legacy property (same as departureTime)
  date: string;
  status: 'On Time' | 'Delayed' | 'Boarding' | 'Departed' | 'Arrived' | 'Cancelled';
  aircraft: string;
  gate?: string;
  terminal?: string;
  totalSeats: number;
  availableSeats: number;
  seatMap?: SeatMap[];
  premiumSeats?: string[];
}

// ============ Services & Shop ============
// Note: ancillaryServices and mealOptions are used as simple string arrays in the application
export type AncillaryService = string;
export type MealOption = string;
export type ShopCategory = string;

export interface ShopItem {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  description?: string;
  image?: string;
}

// ============ Store States ============
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

// ============ Store Actions ============
export interface AuthActions {
  loginStart: () => void;
  loginSuccess: (userData: { user: User; role?: 'admin' | 'staff' }) => void;
  loginFailure: (errorMessage: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setRole: (role: 'admin' | 'staff') => void;
  clearError: () => void;
  loginWithGoogle: (userData: User) => Promise<void>;
  logoutUser: () => Promise<void>;
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

// ============ Combined Store Types ============
export type AuthStore = AuthState & AuthActions;
export type DataStore = DataState & DataActions;
export type CheckInStore = CheckInState & CheckInActions;
export type AdminStore = AdminState & AdminActions;
export type ToastStore = ToastState & ToastActions;

// ============ API Response Types ============
export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

// ============ Component Props ============
export interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message: string;
  severity?: 'warning' | 'error' | 'info';
}

export interface SimpleInputDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (value: string) => void;
  title: string;
  label: string;
  defaultValue?: string;
}

export interface SeatMapVisualProps {
  passengers: Passenger[];
  onSeatClick?: (seat: string) => void;
  selectedSeat?: string;
}

// ============ Form Types ============
export interface PassengerFormData extends Omit<Passenger, 'id'> {
  id?: string;
}

export interface ShopItemFormData extends Omit<ShopItem, 'id'> {
  id?: string;
}
