'use client';

import { useCallback } from 'react';
import { subscribeToFlights, subscribeToPassengers, isFirebaseConfigured } from '../infrastructure/persistence/firestoreService';
import useDataStore from '../stores/useDataStore';
import type { Flight } from '../domain/flights/types';
import type { Passenger } from '../domain/passengers/types';

/**
 * Custom hook for real-time Firestore synchronization
 * Automatically subscribes to Firestore changes and updates the store
 */
export function useFirestoreSync() {
  const { setFlights, setPassengers } = useDataStore();
  const isConfigured = isFirebaseConfigured();

  // Subscribe to flights collection
  const syncFlights = useCallback(() => {
    if (!isConfigured) return () => {};

    console.log('[Firestore] Setting up flights listener...');
    
    const unsubscribe = subscribeToFlights((flights: Flight[]) => {
      console.log(`[Firestore] Received ${flights.length} flights`);
      setFlights(flights);
    });

    return unsubscribe;
  }, [isConfigured, setFlights]);

  // Subscribe to passengers collection
  const syncPassengers = useCallback((flightId?: string | null) => {
    if (!isConfigured) return () => {};

    console.log('[Firestore] Setting up passengers listener...');
    
    const unsubscribe = subscribeToPassengers((passengers: Passenger[]) => {
      console.log(`[Firestore] Received ${passengers.length} passengers`);
      setPassengers(passengers);
    }, flightId);

    return unsubscribe;
  }, [isConfigured, setPassengers]);

  return {
    isConfigured,
    syncFlights,
    syncPassengers,
  };
}

export default useFirestoreSync;
