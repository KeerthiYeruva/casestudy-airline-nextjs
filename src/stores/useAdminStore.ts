'use client';

// Zustand store for admin view state
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AdminStore, Flight, FilterOptions } from '@/types';

const useAdminStore = create<AdminStore>()(
  devtools(
    (set) => ({
      // State
      selectedFlight: null,
      filterOptions: {
        missingPassport: false,
        missingAddress: false,
        missingDOB: false,
      },

      // Actions
      selectFlight: (flight: Flight | null) => set({ selectedFlight: flight }),

      setAdminFilter: (updates: Partial<FilterOptions>) =>
        set((state) => ({
          filterOptions: { ...state.filterOptions, ...updates },
        })),

      clearAdminFilters: () =>
        set({
          filterOptions: {
            missingPassport: false,
            missingAddress: false,
            missingDOB: false,
          },
        }),
    }),
    { name: 'AdminStore' }
  )
);

export default useAdminStore;
