export enum UserRole {
  PASSENGER = 'PASSENGER',
  CHECKIN_AGENT = 'CHECKIN_AGENT',
  CABIN_CREW = 'CABIN_CREW',
  OPERATIONS = 'OPERATIONS',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export type LegacyUserRole = 'admin' | 'staff';

export function normalizeUserRole(role?: UserRole | LegacyUserRole | null): UserRole | null {
  if (role === 'admin') return UserRole.ADMIN;
  if (role === 'staff') return UserRole.CHECKIN_AGENT;
  return role ?? null;
}

export interface RolePermissions {
  canUseCustomerPortal: boolean;
  canUseCheckIn: boolean;
  canUseInFlightServices: boolean;
  canManageFlightOperations: boolean;
  canManagePassengers: boolean;
  canManageServices: boolean;
  canManageSeats: boolean;
  canManageUsers: boolean;
  canAccessAdminDashboard: boolean;
}

export const roleLabels: Record<UserRole, string> = {
  [UserRole.PASSENGER]: 'Passenger',
  [UserRole.CHECKIN_AGENT]: 'Check-In Agent',
  [UserRole.CABIN_CREW]: 'Cabin Crew',
  [UserRole.OPERATIONS]: 'Operations Staff',
  [UserRole.ADMIN]: 'Airline Administrator',
  [UserRole.SUPER_ADMIN]: 'Super Admin',
};

export const roleDescriptions: Record<UserRole, string> = {
  [UserRole.PASSENGER]: 'My Trips, flight status, seat selection, online check-in, and boarding pass access',
  [UserRole.CHECKIN_AGENT]: 'Check-in, passenger search, seat assignment, and boarding pass generation',
  [UserRole.CABIN_CREW]: 'In-flight services, meals, shop purchases, and passenger service history',
  [UserRole.OPERATIONS]: 'Flight status, gate assignment, passenger monitoring, and operational dashboards',
  [UserRole.ADMIN]: 'Passenger, flight, services, seat, crew, aircraft, and reporting management',
  [UserRole.SUPER_ADMIN]: 'Full access, user management, role assignment, system settings, and audit controls',
};

export const rolePermissions: Record<UserRole, RolePermissions> = {
  [UserRole.PASSENGER]: {
    canUseCustomerPortal: true,
    canUseCheckIn: false,
    canUseInFlightServices: false,
    canManageFlightOperations: false,
    canManagePassengers: false,
    canManageServices: false,
    canManageSeats: false,
    canManageUsers: false,
    canAccessAdminDashboard: false,
  },
  [UserRole.CHECKIN_AGENT]: {
    canUseCustomerPortal: false,
    canUseCheckIn: true,
    canUseInFlightServices: false,
    canManageFlightOperations: false,
    canManagePassengers: false,
    canManageServices: false,
    canManageSeats: false,
    canManageUsers: false,
    canAccessAdminDashboard: false,
  },
  [UserRole.CABIN_CREW]: {
    canUseCustomerPortal: false,
    canUseCheckIn: false,
    canUseInFlightServices: true,
    canManageFlightOperations: false,
    canManagePassengers: false,
    canManageServices: false,
    canManageSeats: false,
    canManageUsers: false,
    canAccessAdminDashboard: false,
  },
  [UserRole.OPERATIONS]: {
    canUseCustomerPortal: false,
    canUseCheckIn: true,
    canUseInFlightServices: true,
    canManageFlightOperations: true,
    canManagePassengers: false,
    canManageServices: false,
    canManageSeats: false,
    canManageUsers: false,
    canAccessAdminDashboard: false,
  },
  [UserRole.ADMIN]: {
    canUseCustomerPortal: false,
    canUseCheckIn: true,
    canUseInFlightServices: true,
    canManageFlightOperations: true,
    canManagePassengers: true,
    canManageServices: true,
    canManageSeats: true,
    canManageUsers: false,
    canAccessAdminDashboard: true,
  },
  [UserRole.SUPER_ADMIN]: {
    canUseCustomerPortal: false,
    canUseCheckIn: true,
    canUseInFlightServices: true,
    canManageFlightOperations: true,
    canManagePassengers: true,
    canManageServices: true,
    canManageSeats: true,
    canManageUsers: true,
    canAccessAdminDashboard: true,
  },
};

export const staffRoleOptions = [
  UserRole.CHECKIN_AGENT,
  UserRole.CABIN_CREW,
  UserRole.OPERATIONS,
  UserRole.ADMIN,
  UserRole.SUPER_ADMIN,
];

export interface User {
  uid?: string;
  displayName: string | null;
  email: string | null;
  photoURL?: string | null;
  role?: UserRole;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  role: UserRole | null;
  loading: boolean;
  error: string | null;
}

export interface AuthActions {
  loginStart: () => void;
  loginSuccess: (userData: { user: User; role?: UserRole }) => void;
  loginFailure: (errorMessage: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setRole: (role: UserRole) => void;
  clearError: () => void;
  loginWithGoogle: (userData: User) => Promise<void>;
  logoutUser: () => Promise<void>;
}

export type AuthStore = AuthState & AuthActions;
