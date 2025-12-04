'use client';

import { useEffect, useRef } from 'react';
import useDataStore from '@/stores/useDataStore';

/**
 * Custom hook to keep Zustand store in sync with API
 * Automatically refetches data on mount and when tab becomes visible
 */
export function useDataSync() {
  const { fetchFlights, fetchPassengers } = useDataStore();
  const hasFetched = useRef(false);

  useEffect(() => {
    // Initial fetch on mount
    if (!hasFetched.current) {
      fetchFlights();
      fetchPassengers();
      hasFetched.current = true;
    }

    // Refetch when tab becomes visible (user switches back to app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchFlights();
        fetchPassengers();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [fetchFlights, fetchPassengers]);
}

/**
 * Hook to auto-refresh passenger data for a specific flight
 */
export function usePassengerSync(flightId: string | null) {
  const { fetchPassengers } = useDataStore();

  useEffect(() => {
    if (flightId) {
      fetchPassengers(flightId);
    }
  }, [flightId, fetchPassengers]);
}
