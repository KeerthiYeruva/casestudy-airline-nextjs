'use client';

// Zustand store for check-in view state
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { CheckInStore, Flight, FilterOptions } from '@/types';

const useCheckInStore = create<CheckInStore>()(
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
      selectFlight: (flight: Flight | null) => set({ selectedFlight: flight }),

      setFilter: (filterKey: keyof FilterOptions, value: boolean | null) =>
        set((state) => ({
          filterOptions: { ...state.filterOptions, [filterKey]: value },
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
