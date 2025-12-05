// Real-time event broadcaster using Server-Sent Events (SSE)
// Manages connections and broadcasts updates to all connected clients

type SSEClient = {
  id: string;
  controller: ReadableStreamDefaultController;
  userId?: string;
};

type EventData = {
  type: 'passenger_updated' | 'passenger_checked_in' | 'seat_changed' | 'seat_locked' | 'seat_unlocked' | 'passenger_deleted' | 'flight_updated';
  data: unknown;
  timestamp: number;
};

class EventBroadcaster {
  private clients: Map<string, SSEClient> = new Map();
  private seatLocks: Map<string, { userId: string; expiresAt: number }> = new Map();
  private readonly LOCK_DURATION = 30000; // 30 seconds

  /**
   * Add a new SSE client connection
   */
  addClient(clientId: string, controller: ReadableStreamDefaultController, userId?: string): void {
    this.clients.set(clientId, { id: clientId, controller, userId });
    console.log(`[SSE] Client connected: ${clientId}. Total clients: ${this.clients.size}`);
    
    // Send initial connection confirmation
    this.sendToClient(clientId, {
      type: 'connection_established',
      data: { clientId, connectedAt: Date.now() },
    });
  }

  /**
   * Remove a disconnected client
   */
  removeClient(clientId: string): void {
    const client = this.clients.get(clientId);
    if (client) {
      // Release any seat locks held by this client
      this.releaseClientLocks(client.userId);
      this.clients.delete(clientId);
      console.log(`[SSE] Client disconnected: ${clientId}. Total clients: ${this.clients.size}`);
    }
  }

  /**
   * Broadcast an event to all connected clients
   */
  broadcast(event: Omit<EventData, 'timestamp'>): void {
    const eventWithTimestamp: EventData = {
      ...event,
      timestamp: Date.now(),
    };

    console.log(`[SSE] Broadcasting event: ${event.type} to ${this.clients.size} clients`);

    this.clients.forEach((client) => {
      this.sendToClient(client.id, eventWithTimestamp);
    });
  }

  /**
   * Send event to a specific client
   */
  private sendToClient(clientId: string, event: unknown): void {
    const client = this.clients.get(clientId);
    if (!client) return;

    try {
      const encoder = new TextEncoder();
      const data = `data: ${JSON.stringify(event)}\n\n`;
      client.controller.enqueue(encoder.encode(data));
    } catch (error) {
      console.error(`[SSE] Error sending to client ${clientId}:`, error);
      this.removeClient(clientId);
    }
  }

  /**
   * Lock a seat to prevent concurrent modifications
   */
  lockSeat(seatId: string, userId: string): boolean {
    const existingLock = this.seatLocks.get(seatId);
    
    // Check if lock expired
    if (existingLock && existingLock.expiresAt < Date.now()) {
      this.seatLocks.delete(seatId);
    }

    // Check if seat is locked by another user
    const currentLock = this.seatLocks.get(seatId);
    if (currentLock && currentLock.userId !== userId) {
      return false; // Seat is locked by another user
    }

    // Create or refresh lock
    this.seatLocks.set(seatId, {
      userId,
      expiresAt: Date.now() + this.LOCK_DURATION,
    });

    // Broadcast lock event
    this.broadcast({
      type: 'seat_locked',
      data: { seatId, userId, expiresAt: Date.now() + this.LOCK_DURATION },
    });

    console.log(`[SSE] Seat locked: ${seatId} by ${userId}`);
    return true;
  }

  /**
   * Unlock a seat
   */
  unlockSeat(seatId: string, userId: string): void {
    const lock = this.seatLocks.get(seatId);
    
    // Only allow unlock if user owns the lock
    if (lock && lock.userId === userId) {
      this.seatLocks.delete(seatId);
      
      // Broadcast unlock event
      this.broadcast({
        type: 'seat_unlocked',
        data: { seatId, userId },
      });

      console.log(`[SSE] Seat unlocked: ${seatId} by ${userId}`);
    }
  }

  /**
   * Release all locks held by a user (on disconnect)
   */
  private releaseClientLocks(userId?: string): void {
    if (!userId) return;

    const locksToRelease: string[] = [];
    
    this.seatLocks.forEach((lock, seatId) => {
      if (lock.userId === userId) {
        locksToRelease.push(seatId);
      }
    });

    locksToRelease.forEach((seatId) => {
      this.seatLocks.delete(seatId);
      this.broadcast({
        type: 'seat_unlocked',
        data: { seatId, userId },
      });
    });

    if (locksToRelease.length > 0) {
      console.log(`[SSE] Released ${locksToRelease.length} locks for user ${userId}`);
    }
  }

  /**
   * Check if a seat is currently locked
   */
  isSeatLocked(seatId: string, userId: string): boolean {
    const lock = this.seatLocks.get(seatId);
    
    if (!lock) return false;
    
    // Check if lock expired
    if (lock.expiresAt < Date.now()) {
      this.seatLocks.delete(seatId);
      return false;
    }

    // Seat is locked by another user
    return lock.userId !== userId;
  }

  /**
   * Get all currently locked seats
   */
  getLockedSeats(): Array<{ seatId: string; userId: string; expiresAt: number }> {
    const now = Date.now();
    const lockedSeats: Array<{ seatId: string; userId: string; expiresAt: number }> = [];

    this.seatLocks.forEach((lock, seatId) => {
      if (lock.expiresAt > now) {
        lockedSeats.push({ seatId, ...lock });
      } else {
        // Clean up expired locks
        this.seatLocks.delete(seatId);
      }
    });

    return lockedSeats;
  }

  /**
   * Get connection count for monitoring
   */
  getClientCount(): number {
    return this.clients.size;
  }

  /**
   * Clean up expired locks (called periodically)
   */
  cleanupExpiredLocks(): void {
    const now = Date.now();
    const expiredSeats: string[] = [];

    this.seatLocks.forEach((lock, seatId) => {
      if (lock.expiresAt < now) {
        expiredSeats.push(seatId);
      }
    });

    expiredSeats.forEach((seatId) => {
      const lock = this.seatLocks.get(seatId);
      if (lock) {
        this.seatLocks.delete(seatId);
        this.broadcast({
          type: 'seat_unlocked',
          data: { seatId, userId: lock.userId },
        });
      }
    });

    if (expiredSeats.length > 0) {
      console.log(`[SSE] Cleaned up ${expiredSeats.length} expired seat locks`);
    }
  }
}

// Singleton instance
export const eventBroadcaster = new EventBroadcaster();

// Cleanup expired locks every 10 seconds
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    eventBroadcaster.cleanupExpiredLocks();
  }, 10000);
}

// Type exports for use in API routes
export type { EventData, SSEClient };
