'use client';

// Zustand store for admin view state
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useAdminStore = create(
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
      selectFlight: (flight) => set({ selectedFlight: flight }),

      setAdminFilter: (filters) =>
        set((state) => ({
          filterOptions: { ...state.filterOptions, ...filters },
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
