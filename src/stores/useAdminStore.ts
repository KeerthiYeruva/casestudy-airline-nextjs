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

      setAdminFilter: (filterKey: keyof FilterOptions, value: boolean) =>
        set((state) => ({
          filterOptions: { ...state.filterOptions, [filterKey]: value },
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
