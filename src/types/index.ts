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
}

export interface Flight {
  id: string;
  flightNumber: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  date: string;
  status: 'On Time' | 'Delayed' | 'Boarding' | 'Departed' | 'Arrived' | 'Cancelled';
  aircraft: string;
  gate?: string;
  terminal?: string;
  totalSeats: number;
  availableSeats: number;
}

// ============ Services & Shop ============
export interface AncillaryService {
  id: string;
  name: string;
  price?: number;
  category?: string;
}

export interface MealOption {
  id: string;
  name: string;
  type: string;
  description?: string;
}

export interface ShopItem {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  description?: string;
  image?: string;
}

export interface ShopCategory {
  id: string;
  name: string;
  icon?: string;
}

// ============ Store States ============
export interface DataState {
  flights: Flight[];
  passengers: Passenger[];
  ancillaryServices: AncillaryService[];
  mealOptions: MealOption[];
  shopItems: ShopItem[];
  shopCategories: ShopCategory[];
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
  addFlight: (flight: Partial<Flight>) => Promise<Flight | null>;
  updateFlight: (id: string, updates: Partial<Flight>) => Promise<Flight | null>;
  deleteFlight: (id: string) => Promise<Flight | null>;
  addPassenger: (passenger: Partial<Passenger>) => Promise<Passenger | null>;
  updatePassenger: (id: string, updates: Partial<Passenger>) => Promise<Passenger | null>;
  deletePassenger: (id: string) => Promise<Passenger | null>;
  checkInPassenger: (id: string) => Promise<Passenger | null>;
  undoCheckIn: (id: string) => Promise<Passenger | null>;
  changeSeat: (id: string, newSeat: string) => Promise<Passenger | null>;
  setAncillaryServices: (services: AncillaryService[]) => void;
  setMealOptions: (meals: MealOption[]) => void;
  setShopItems: (items: ShopItem[]) => void;
  setShopCategories: (categories: ShopCategory[]) => void;
}

export interface CheckInActions {
  selectFlight: (flight: Flight | null) => void;
  setFilter: (filterKey: keyof FilterOptions, value: boolean | null) => void;
  clearFilters: () => void;
}

export interface AdminActions {
  selectFlight: (flight: Flight | null) => void;
  setAdminFilter: (filterKey: keyof FilterOptions, value: boolean) => void;
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
export interface APIResponse<T = any> {
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
