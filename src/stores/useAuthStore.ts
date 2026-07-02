'use client';

// Zustand store for authentication
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { normalizeUserRole, UserRole } from '../domain/auth/types';
import type { AuthStore, User } from '../domain/auth/types';

const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set) => ({
        // State
        user: null,
        isAuthenticated: false,
        role: null,
        loading: false,
        error: null,

        // Actions
        loginStart: () => set({ loading: true, error: null }),

        loginSuccess: (userData: { user: User; role?: UserRole }) =>
          set({
            loading: false,
            isAuthenticated: true,
            user: userData.user,
            role: normalizeUserRole(userData.role),
            error: null,
          }),

        loginFailure: (errorMessage: string) =>
          set({
            loading: false,
            isAuthenticated: false,
            user: null,
            role: null,
            error: errorMessage,
          }),

        logout: () =>
          set({
            user: null,
            isAuthenticated: false,
            role: null,
            loading: false,
            error: null,
          }),

        setUser: (user: User) => set({ user, isAuthenticated: !!user }),

        setRole: (role: UserRole) => set({ role }),

        clearError: () => set({ error: null }),

        // Mock Google login (replace with real Firebase later)
        loginWithGoogle: async (userData: User) => {
          set({ loading: true, error: null });
          try {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 500));
            set({
              loading: false,
              isAuthenticated: true,
              user: userData,
              role: normalizeUserRole(userData.role),
              error: null,
            });
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Login failed',
            });
          }
        },

        // Mock logout
        logoutUser: async () => {
          set({ loading: true });
          try {
            // Simulate network delay
            await new Promise((resolve) => setTimeout(resolve, 300));
            set({
              user: null,
              isAuthenticated: false,
              role: null,
              loading: false,
              error: null,
            });
          } catch (error) {
            set({
              loading: false,
              error: error instanceof Error ? error.message : 'Logout failed',
            });
          }
        },
      }),
      {
        name: 'airline-auth-session',
        partialize: (state) => ({
          user: state.user,
          isAuthenticated: state.isAuthenticated,
          role: state.role,
        }),
      }
    ),
    { name: 'AuthStore' }
  )
);

export default useAuthStore;
