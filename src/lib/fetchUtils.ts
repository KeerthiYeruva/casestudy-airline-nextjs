/**
 * Data Fetching Utilities with Caching
 * 
 * Provides optimized data fetching functions with Next.js caching support
 * for Server Components and API routes.
 */

import type { Flight, Passenger } from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

/**
 * Fetch flights with caching support
 * Uses Next.js fetch cache by default
 */
export async function fetchFlights(): Promise<Flight[]> {
  const response = await fetch(`${API_BASE_URL}/api/flights`, {
    next: { 
      revalidate: 60 // Cache for 60 seconds
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch flights');
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Fetch single flight by ID with caching
 */
export async function fetchFlightById(id: string): Promise<Flight> {
  const response = await fetch(`${API_BASE_URL}/api/flights/${id}`, {
    next: { 
      revalidate: 60
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch flight');
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Fetch passengers with optional flight filter
 * Shorter cache time for frequently updated data
 */
export async function fetchPassengers(flightId?: string): Promise<Passenger[]> {
  const url = flightId 
    ? `${API_BASE_URL}/api/passengers?flightId=${flightId}`
    : `${API_BASE_URL}/api/passengers`;
    
  const response = await fetch(url, {
    next: { 
      revalidate: 30 // Cache for 30 seconds
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch passengers');
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Fetch passenger by ID with caching
 */
export async function fetchPassengerById(id: string): Promise<Passenger> {
  const response = await fetch(`${API_BASE_URL}/api/passengers/${id}`, {
    next: { 
      revalidate: 30
    }
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch passenger');
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Client-side fetch with SWR-like behavior
 * Used in Client Components for real-time updates
 */
export async function fetchClientSide<T>(
  url: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Fetch failed: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data.data;
}

/**
 * Revalidate cache paths on-demand
 * Call after mutations to invalidate stale data
 */
export async function revalidatePaths(paths: string[]) {
  if (typeof window !== 'undefined') {
    // Client-side: trigger revalidation via API
    await fetch('/api/revalidate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ paths }),
    });
  } else {
    // Server-side: use Next.js revalidatePath
    const { revalidatePath } = await import('next/cache');
    paths.forEach(path => {
      try {
        revalidatePath(path);
      } catch (e) {
        console.warn(`Failed to revalidate path ${path}:`, e);
      }
    });
  }
}
