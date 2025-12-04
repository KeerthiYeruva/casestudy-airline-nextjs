'use client';

// Zustand store for check-in view state
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

const useCheckInStore = create(
  devtools(
    (set) => ({
      // State
      selectedFlight: null,
      filterOptions: {
        checkedIn: null, // null = all, true = checked in, false = not checked in
        wheelchair: false,
        infant: false,
      },

      // Actions
      selectFlight: (flight) => set({ selectedFlight: flight }),

      setFilter: (filters) =>
        set((state) => ({
          filterOptions: { ...state.filterOptions, ...filters },
        })),

      clearFilters: () =>
        set({
          filterOptions: {
            checkedIn: null,
            wheelchair: false,
            infant: false,
          },
        }),
    }),
    { name: 'CheckInStore' }
  )
);

export default useCheckInStore;
