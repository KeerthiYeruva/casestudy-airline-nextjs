// API Route for Passengers CRUD operations (TypeScript)
import { passengerDB } from '@/lib/db';
import { handleApiError, successResponse, HTTP_STATUS } from '@/lib/apiUtils';
import { CreatePassengerSchema, validateSchema } from '@/lib/validationSchemas';
import { revalidatePath } from 'next/cache';
import type { Passenger } from '@/types';

// Enable dynamic caching with revalidation
export const revalidate = 30; // Revalidate every 30 seconds for frequently updated passenger data

// GET all passengers or filter by flightId with caching
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const flightId = searchParams.get('flightId');
    
    let passengers: Passenger[];
    if (flightId) {
      passengers = await passengerDB.getByFlightId(flightId);
    } else {
      passengers = await passengerDB.getAll();
    }
    
    const response = successResponse(passengers);
    
    // Add cache control headers with shorter cache time for dynamic data
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=30, stale-while-revalidate=60'
    );
    
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

// POST create new passenger with cache revalidation
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = validateSchema(CreatePassengerSchema, body);
    const newPassenger = await passengerDB.create(validatedData as Partial<Passenger>);
    
    // Revalidate cache after creation
    try {
      revalidatePath('/api/passengers');
    } catch (e) {
      // Cache revalidation is best-effort
      console.warn('Cache revalidation failed:', e);
    }
    
    return successResponse(newPassenger, HTTP_STATUS.CREATED);
  } catch (error) {
    return handleApiError(error);
  }
}
