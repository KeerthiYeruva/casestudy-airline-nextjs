'use client';

import { ReactNode } from 'react';
import ToastNotification from '@/components/ToastNotification';
import FirestoreSync from '@/components/FirestoreSync';

interface ClientLayoutProps {
  children: ReactNode;
}

/**
 * ClientLayout Component
 * 
 * Wraps the application with client-side features:
 * - Toast notifications for user feedback
 * - Firestore real-time data synchronization
 * 
 * This is separated from the root layout to allow use of React hooks
 * and client-side state management while keeping the root layout as
 * a Server Component for better performance.
 */
export default function ClientLayout({ children }: ClientLayoutProps) {
  return (
    <>
      {children}
      <FirestoreSync />
      <ToastNotification />
    </>
  );
}
