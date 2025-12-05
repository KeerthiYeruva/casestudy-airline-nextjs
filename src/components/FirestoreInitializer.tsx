'use client';

import { useEffect, useState } from 'react';
import { initializeFirestoreData, isFirebaseConfigured } from '@/lib/firestoreService';
import useAuthStore from '@/stores/useAuthStore';

/**
 * FirestoreInitializer Component
 * 
 * Automatically seeds Firestore with initial data on first load
 * when Firebase is configured and collections are empty.
 * 
 * This component runs once when:
 * - User is authenticated
 * - Firebase is properly configured
 * - Firestore collections are empty
 */
export default function FirestoreInitializer() {
  const { isAuthenticated, user } = useAuthStore();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    const initialize = async () => {
      // Only run once per session
      if (initialized) return;
      
      // Only initialize when user is authenticated
      if (!isAuthenticated || !user) return;

      // Check if Firebase is configured
      if (!isFirebaseConfigured()) {
        console.log('[FirestoreInitializer] Firebase not configured, using in-memory storage');
        setInitialized(true);
        return;
      }

      try {
        console.log('[FirestoreInitializer] Checking Firestore data...');
        await initializeFirestoreData();
        setInitialized(true);
        console.log('[FirestoreInitializer] Initialization complete');
      } catch (error) {
        console.error('[FirestoreInitializer] Initialization failed:', error);
        // Don't set initialized to true on error, allow retry on next mount
      }
    };

    initialize();
  }, [isAuthenticated, user, initialized]);

  // This component doesn't render anything
  return null;
}
