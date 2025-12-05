'use client';

import { useEffect } from 'react';
import { useFirestoreSync } from '@/hooks/useFirestoreSync';
import useAuthStore from '@/stores/useAuthStore';

/**
 * FirestoreSync Component
 * 
 * Manages real-time synchronization with Firestore database.
 * This component should be mounted once at the app level to enable
 * automatic data synchronization for authenticated users.
 * 
 * Features:
 * - Automatically syncs flights and passengers from Firestore
 * - Only activates when user is authenticated
 * - Cleans up listeners on unmount
 * - Falls back gracefully when Firebase is not configured
 */
export default function FirestoreSync() {
  const { isAuthenticated, user } = useAuthStore();
  const { syncFlights, syncPassengers } = useFirestoreSync();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      return;
    }

    // Start syncing flights and passengers
    const unsubscribeFlights = syncFlights();
    const unsubscribePassengers = syncPassengers();

    // Cleanup on unmount or when auth state changes
    return () => {
      unsubscribeFlights();
      unsubscribePassengers();
    };
  }, [isAuthenticated, user, syncFlights, syncPassengers]);

  // This component doesn't render anything
  return null;
}
