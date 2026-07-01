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

export type AuthStore = AuthState & AuthActions;
