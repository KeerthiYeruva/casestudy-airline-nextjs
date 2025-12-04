'use client';

// Zustand store for authentication
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AuthStore, User } from '@/types';

const useAuthStore = create<AuthStore>()(
  devtools(
    (set) => ({
      // State
      user: null,
      isAuthenticated: false,
      role: null,
      loading: false,
      error: null,

      // Actions
      loginStart: () => set({ loading: true, error: null }),

      loginSuccess: (userData: { user: User; role?: 'admin' | 'staff' }) =>
        set({
          loading: false,
          isAuthenticated: true,
          user: userData.user,
          role: userData.role || 'staff',
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

      setRole: (role: 'admin' | 'staff') => set({ role }),

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
            role: userData.role || 'staff',
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
    { name: 'AuthStore' }
  )
);

export default useAuthStore;
