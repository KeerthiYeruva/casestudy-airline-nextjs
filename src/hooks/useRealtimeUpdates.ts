'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import useAuthStore from '@/stores/useAuthStore';
import useDataStore from '@/stores/useDataStore';
import { Passenger } from '@/types';

type EventType = 
  | 'passenger_updated' 
  | 'passenger_checked_in' 
  | 'seat_changed' 
  | 'seat_locked' 
  | 'seat_unlocked' 
  | 'passenger_deleted' 
  | 'flight_updated'
  | 'connected'
  | 'connection_established';

interface SSEEvent {
  type: EventType;
  data: unknown;
  timestamp?: number;
  clientId?: string;
  userId?: string;
}

interface LockedSeat {
  seatId: string;
  userId: string;
  expiresAt: number;
}

/**
 * Custom hook for real-time updates using Server-Sent Events (SSE)
 * Automatically reconnects on connection loss
 */
export function useRealtimeUpdates() {
  const { user } = useAuthStore();
  const { fetchPassengers, fetchFlights } = useDataStore();
  const eventSourceRef = useRef<EventSource | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [lockedSeats, setLockedSeats] = useState<Map<string, LockedSeat>>(new Map());
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [connectionAttempts, setConnectionAttempts] = useState(0);

  /**
   * Lock a seat to prevent concurrent modifications
   */
  const lockSeat = useCallback(async (seatId: string): Promise<boolean> => {
    if (!user?.uid) return false;

    try {
      const response = await fetch('/api/seats/lock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ seatId, userId: user.uid }),
      });

      const result = await response.json();
      return result.data?.success ?? false;
    } catch (error) {
      console.error('Failed to lock seat:', error);
      return false;
    }
  }, [user]);

  /**
   * Unlock a seat
   */
  const unlockSeat = useCallback(async (seatId: string): Promise<void> => {
    if (!user?.uid) return;

    try {
      await fetch(`/api/seats/lock?seatId=${seatId}&userId=${user.uid}`, {
        method: 'DELETE',
      });
    } catch (error) {
      console.error('Failed to unlock seat:', error);
    }
  }, [user]);

  /**
   * Check if a seat is locked by another user
   */
  const isSeatLocked = useCallback((seatId: string): boolean => {
    const lock = lockedSeats.get(seatId);
    if (!lock) return false;
    
    // Check if lock expired
    if (lock.expiresAt < Date.now()) {
      setLockedSeats(prev => {
        const next = new Map(prev);
        next.delete(seatId);
        return next;
      });
      return false;
    }

    // Check if locked by current user
    return lock.userId !== user?.uid;
  }, [lockedSeats, user]);

  /**
   * Handle incoming SSE events
   */
  const handleEvent = useCallback((event: MessageEvent) => {
    try {
      const eventData: SSEEvent = JSON.parse(event.data);
      
      console.log('[Realtime] Received event:', eventData.type);

      switch (eventData.type) {
        case 'connected':
        case 'connection_established':
          console.log('[Realtime] Connection established');
          setIsConnected(true);
          setConnectionAttempts(0);
          break;

        case 'passenger_updated':
        case 'passenger_checked_in':
        case 'seat_changed':
        case 'passenger_deleted': {
          // Refresh passenger data for the affected flight
          const updatedPassenger = eventData.data as Passenger;
          if (updatedPassenger?.flightId) {
            console.log('[Realtime] Refreshing passengers after update');
            fetchPassengers(updatedPassenger.flightId);
          } else {
            // Refresh all passengers if no specific flight
            fetchPassengers();
          }
          break;
        }

        case 'flight_updated': {
          // Refresh all flights
          console.log('[Realtime] Refreshing flights after update');
          fetchFlights();
          break;
        }

        case 'seat_locked': {
          const lockData = eventData.data as LockedSeat;
          if (lockData && lockData.seatId) {
            setLockedSeats(prev => {
              const next = new Map(prev);
              next.set(lockData.seatId, lockData);
              return next;
            });
          }
          break;
        }

        case 'seat_unlocked': {
          const unlockData = eventData.data as { seatId: string; userId: string };
          if (unlockData?.seatId) {
            setLockedSeats(prev => {
              const next = new Map(prev);
              next.delete(unlockData.seatId);
              return next;
            });
          }
          break;
        }

        default:
          console.log('[Realtime] Unknown event type:', eventData.type);
      }
    } catch (error) {
      console.error('[Realtime] Error handling event:', error);
    }
  }, [fetchPassengers, fetchFlights]);

  /**
   * Connect to SSE endpoint
   */
  const connectRef = useRef<(() => void) | undefined>(undefined);
  
  const connect = useCallback(() => {
    if (eventSourceRef.current?.readyState === EventSource.OPEN) {
      console.log('[Realtime] Already connected');
      return;
    }

    const userId = user?.uid || 'anonymous';
    const url = `/api/events?userId=${userId}`;

    console.log('[Realtime] Connecting to SSE...');
    const eventSource = new EventSource(url);

    eventSource.onmessage = handleEvent;

    eventSource.onerror = (error) => {
      console.error('[Realtime] SSE connection error:', error);
      setIsConnected(false);
      eventSource.close();

      // Exponential backoff for reconnection
      const backoffDelay = Math.min(1000 * Math.pow(2, connectionAttempts), 30000);
      console.log(`[Realtime] Reconnecting in ${backoffDelay}ms...`);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        setConnectionAttempts(prev => prev + 1);
        connectRef.current?.();
      }, backoffDelay);
    };

    eventSource.onopen = () => {
      console.log('[Realtime] SSE connection opened');
      setIsConnected(true);
      setConnectionAttempts(0);
    };

    eventSourceRef.current = eventSource;
  }, [user, handleEvent, connectionAttempts]);
  
  // Keep ref updated
  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  /**
   * Disconnect from SSE endpoint
   */
  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }

    if (eventSourceRef.current) {
      console.log('[Realtime] Disconnecting from SSE');
      eventSourceRef.current.close();
      eventSourceRef.current = null;
      setIsConnected(false);
    }
  }, []);

  // Auto-connect on mount, disconnect on unmount
  useEffect(() => {
    connect();
    return () => disconnect();
  }, [connect, disconnect]);

  // Cleanup locked seats periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setLockedSeats(prev => {
        const next = new Map(prev);
        let changed = false;
        
        prev.forEach((lock, seatId) => {
          if (lock.expiresAt < now) {
            next.delete(seatId);
            changed = true;
          }
        });

        return changed ? next : prev;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return {
    isConnected,
    lockedSeats: Array.from(lockedSeats.values()),
    lockSeat,
    unlockSeat,
    isSeatLocked,
    reconnect: connect,
    disconnect,
  };
}

export default useRealtimeUpdates;
