// Firestore Service Layer - Persistent data operations
import { 
  db, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  onSnapshot
} from './firebaseConfig';
import type { Flight, Passenger } from '@/types';
import { flights as initialFlights, passengers as initialPassengers, shopItems as initialShopItems } from '@/data/flightData';

// Collection names
const COLLECTIONS = {
  FLIGHTS: 'flights',
  PASSENGERS: 'passengers',
  SHOP_ITEMS: 'shopItems',
  ANCILLARY_SERVICES: 'ancillaryServices',
  MEAL_OPTIONS: 'mealOptions',
  SHOP_CATEGORIES: 'shopCategories',
} as const;

// Flag to track if using Firebase or fallback
let useFirebase = false;

// Check if Firebase is configured
export function isFirebaseConfigured(): boolean {
  try {
    const config = db.app.options;
    useFirebase = config.apiKey !== 'YOUR_API_KEY' && config.projectId !== 'YOUR_PROJECT_ID';
    return useFirebase;
  } catch {
    useFirebase = false;
    return false;
  }
}

/**
 * Initialize Firestore with sample data if collections are empty
 */
export async function initializeFirestoreData(): Promise<void> {
  if (!isFirebaseConfigured()) {
    console.log('[Firestore] Not configured - using in-memory storage');
    return;
  }

  try {
    // Check if data already exists
    const flightsSnapshot = await getDocs(collection(db, COLLECTIONS.FLIGHTS));
    
    if (flightsSnapshot.empty) {
      console.log('[Firestore] Initializing with sample data...');

      // Add flights
      for (const flight of initialFlights) {
        await addDoc(collection(db, COLLECTIONS.FLIGHTS), flight);
      }

      // Add passengers
      for (const passenger of initialPassengers) {
        await addDoc(collection(db, COLLECTIONS.PASSENGERS), passenger);
      }

      // Add shop items
      for (const item of initialShopItems) {
        await addDoc(collection(db, COLLECTIONS.SHOP_ITEMS), item);
      }

      console.log('[Firestore] Sample data initialized successfully');
    } else {
      console.log('[Firestore] Data already exists');
    }
  } catch (error) {
    console.error('[Firestore] Initialization error:', error);
    useFirebase = false;
  }
}

// ============ Flights ============

export async function getAllFlights(): Promise<Flight[]> {
  if (!useFirebase) return initialFlights;

  try {
    const snapshot = await getDocs(collection(db, COLLECTIONS.FLIGHTS));
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Flight));
  } catch (error) {
    console.error('[Firestore] Error fetching flights:', error);
    return initialFlights;
  }
}

export async function getFlightById(id: string): Promise<Flight | null> {
  if (!useFirebase) return initialFlights.find(f => f.id === id) || null;

  try {
    const docRef = doc(db, COLLECTIONS.FLIGHTS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Flight : null;
  } catch (error) {
    console.error('[Firestore] Error fetching flight:', error);
    return null;
  }
}

export async function createFlight(flight: Omit<Flight, 'id'>): Promise<Flight> {
  if (!useFirebase) {
    const newFlight = { ...flight, id: `FL${Date.now()}` };
    initialFlights.push(newFlight);
    return newFlight;
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.FLIGHTS), flight);
    return { id: docRef.id, ...flight };
  } catch (error) {
    console.error('[Firestore] Error creating flight:', error);
    throw error;
  }
}

export async function updateFlight(id: string, updates: Partial<Flight>): Promise<Flight | null> {
  if (!useFirebase) {
    const index = initialFlights.findIndex(f => f.id === id);
    if (index === -1) return null;
    initialFlights[index] = { ...initialFlights[index], ...updates };
    return initialFlights[index];
  }

  try {
    const docRef = doc(db, COLLECTIONS.FLIGHTS, id);
    await updateDoc(docRef, updates as Record<string, unknown>);
    const updated = await getFlightById(id);
    return updated;
  } catch (error) {
    console.error('[Firestore] Error updating flight:', error);
    return null;
  }
}

export async function deleteFlight(id: string): Promise<boolean> {
  if (!useFirebase) {
    const index = initialFlights.findIndex(f => f.id === id);
    if (index === -1) return false;
    initialFlights.splice(index, 1);
    return true;
  }

  try {
    await deleteDoc(doc(db, COLLECTIONS.FLIGHTS, id));
    return true;
  } catch (error) {
    console.error('[Firestore] Error deleting flight:', error);
    return false;
  }
}

// ============ Passengers ============

export async function getAllPassengers(flightId?: string | null): Promise<Passenger[]> {
  if (!useFirebase) {
    return flightId 
      ? initialPassengers.filter(p => p.flightId === flightId)
      : initialPassengers;
  }

  try {
    const collectionRef = collection(db, COLLECTIONS.PASSENGERS);
    const q = flightId 
      ? query(collectionRef, where('flightId', '==', flightId))
      : collectionRef;
    
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Passenger));
  } catch (error) {
    console.error('[Firestore] Error fetching passengers:', error);
    return flightId 
      ? initialPassengers.filter(p => p.flightId === flightId)
      : initialPassengers;
  }
}

export async function getPassengerById(id: string): Promise<Passenger | null> {
  if (!useFirebase) return initialPassengers.find(p => p.id === id) || null;

  try {
    const docRef = doc(db, COLLECTIONS.PASSENGERS, id);
    const docSnap = await getDoc(docRef);
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } as Passenger : null;
  } catch (error) {
    console.error('[Firestore] Error fetching passenger:', error);
    return null;
  }
}

export async function createPassenger(passenger: Omit<Passenger, 'id'>): Promise<Passenger> {
  if (!useFirebase) {
    const newPassenger = { ...passenger, id: `P${Date.now()}` };
    initialPassengers.push(newPassenger);
    return newPassenger;
  }

  try {
    const docRef = await addDoc(collection(db, COLLECTIONS.PASSENGERS), passenger);
    return { id: docRef.id, ...passenger };
  } catch (error) {
    console.error('[Firestore] Error creating passenger:', error);
    throw error;
  }
}

export async function updatePassenger(id: string, updates: Partial<Passenger>): Promise<Passenger | null> {
  if (!useFirebase) {
    const index = initialPassengers.findIndex(p => p.id === id);
    if (index === -1) return null;
    initialPassengers[index] = { ...initialPassengers[index], ...updates };
    return initialPassengers[index];
  }

  try {
    const docRef = doc(db, COLLECTIONS.PASSENGERS, id);
    await updateDoc(docRef, updates as Record<string, unknown>);
    const updated = await getPassengerById(id);
    return updated;
  } catch (error) {
    console.error('[Firestore] Error updating passenger:', error);
    return null;
  }
}

export async function deletePassenger(id: string): Promise<boolean> {
  if (!useFirebase) {
    const index = initialPassengers.findIndex(p => p.id === id);
    if (index === -1) return false;
    initialPassengers.splice(index, 1);
    return true;
  }

  try {
    await deleteDoc(doc(db, COLLECTIONS.PASSENGERS, id));
    return true;
  } catch (error) {
    console.error('[Firestore] Error deleting passenger:', error);
    return false;
  }
}

// ============ Real-time Listeners ============

export type UnsubscribeFunction = () => void;

export function subscribeToFlights(callback: (flights: Flight[]) => void): UnsubscribeFunction {
  if (!useFirebase) {
    // Fallback: just call once
    callback(initialFlights);
    return () => {};
  }

  try {
    return onSnapshot(
      collection(db, COLLECTIONS.FLIGHTS),
      (snapshot) => {
        const flights = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Flight));
        callback(flights);
      },
      (error) => {
        console.error('[Firestore] Error in flights listener:', error);
        callback(initialFlights);
      }
    );
  } catch (error) {
    console.error('[Firestore] Error setting up flights listener:', error);
    callback(initialFlights);
    return () => {};
  }
}

export function subscribeToPassengers(
  callback: (passengers: Passenger[]) => void,
  flightId?: string | null
): UnsubscribeFunction {
  if (!useFirebase) {
    // Fallback: just call once
    const filtered = flightId 
      ? initialPassengers.filter(p => p.flightId === flightId)
      : initialPassengers;
    callback(filtered);
    return () => {};
  }

  try {
    const collectionRef = collection(db, COLLECTIONS.PASSENGERS);
    const q = flightId 
      ? query(collectionRef, where('flightId', '==', flightId))
      : collectionRef;

    return onSnapshot(
      q,
      (snapshot) => {
        const passengers = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          ...doc.data() 
        } as Passenger));
        callback(passengers);
      },
      (error) => {
        console.error('[Firestore] Error in passengers listener:', error);
        const filtered = flightId 
          ? initialPassengers.filter(p => p.flightId === flightId)
          : initialPassengers;
        callback(filtered);
      }
    );
  } catch (error) {
    console.error('[Firestore] Error setting up passengers listener:', error);
    const filtered = flightId 
      ? initialPassengers.filter(p => p.flightId === flightId)
      : initialPassengers;
    callback(filtered);
    return () => {};
  }
}

/**
 * Reset Firestore data to initial state
 * Deletes all existing data and re-seeds with initial data
 */
export async function resetFirestoreData(): Promise<void> {
  if (!isFirebaseConfigured()) {
    console.log('[Firestore] Not configured - skipping reset');
    return;
  }

  try {
    console.log('[Firestore] Resetting data...');

    // Delete all existing flights
    const flightsSnapshot = await getDocs(collection(db, COLLECTIONS.FLIGHTS));
    for (const docSnapshot of flightsSnapshot.docs) {
      await deleteDoc(doc(db, COLLECTIONS.FLIGHTS, docSnapshot.id));
    }

    // Delete all existing passengers
    const passengersSnapshot = await getDocs(collection(db, COLLECTIONS.PASSENGERS));
    for (const docSnapshot of passengersSnapshot.docs) {
      await deleteDoc(doc(db, COLLECTIONS.PASSENGERS, docSnapshot.id));
    }

    // Delete all existing shop items
    const shopItemsSnapshot = await getDocs(collection(db, COLLECTIONS.SHOP_ITEMS));
    for (const docSnapshot of shopItemsSnapshot.docs) {
      await deleteDoc(doc(db, COLLECTIONS.SHOP_ITEMS, docSnapshot.id));
    }

    console.log('[Firestore] Old data deleted');

    // Re-initialize with sample data
    await initializeFirestoreData();

    console.log('[Firestore] Data reset complete');
  } catch (error) {
    console.error('[Firestore] Error resetting data:', error);
    throw error;
  }
}

// Initialize on module load (client-side only)
if (typeof window !== 'undefined') {
  isFirebaseConfigured();
}
