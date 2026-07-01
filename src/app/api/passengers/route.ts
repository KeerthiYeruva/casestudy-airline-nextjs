// API Route for Passengers CRUD operations (TypeScript)
import { passengerDB } from '@/lib/db';
import { handleApiError, successResponse, HTTP_STATUS } from '@/lib/apiUtils';
import { CreatePassengerSchema, validateSchema } from '@/lib/validationSchemas';
import { eventBroadcaster } from '@/lib/eventBroadcaster';
import { revalidatePath } from 'next/cache';
import type { Passenger } from '@/types/passenger';

export const dynamic = 'force-dynamic';

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
    
    response.headers.set('Cache-Control', 'no-store');
    
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
      if (newPassenger.flightId) {
        revalidatePath(`/api/passengers?flightId=${newPassenger.flightId}`);
      }
    } catch (e) {
      // Cache revalidation is best-effort
      console.warn('Cache revalidation failed:', e);
    }

    eventBroadcaster.broadcast({
      type: 'passenger_updated',
      data: newPassenger,
    });
    
    return successResponse(newPassenger, HTTP_STATUS.CREATED);
  } catch (error) {
    return handleApiError(error);
  }
}
