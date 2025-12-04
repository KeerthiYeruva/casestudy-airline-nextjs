'use client';

// Zustand store for authentication
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useAuthStore = create(
  devtools(
    (set) => ({
      // State
      user: null,
      isAuthenticated: false,
      role: null, // 'admin' or 'staff'
      loading: false,
      error: null,

      // Actions
      loginStart: () => set({ loading: true, error: null }),

      loginSuccess: (userData) =>
        set({
          loading: false,
          isAuthenticated: true,
          user: userData.user,
          role: userData.role || 'staff',
          error: null,
        }),

      loginFailure: (errorMessage) =>
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

      setUser: (user) => set({ user, isAuthenticated: !!user }),

      setRole: (role) => set({ role }),

      clearError: () => set({ error: null }),

      // Mock Google login (replace with real Firebase later)
      loginWithGoogle: async (userData) => {
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
            error: error.message,
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
            error: error.message,
          });
        }
      },
    }),
    { name: 'AuthStore' }
  )
);

export default useAuthStore;
