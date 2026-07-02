// API Route for Flights CRUD operations (TypeScript)
import { flightDB } from '../../../infrastructure/persistence/db';
import { handleApiError, successResponse, HTTP_STATUS } from '../../../infrastructure/api/apiUtils';
import { CreateFlightSchema, validateSchema } from '../../../domain/validation/schemas';
import { eventBroadcaster } from '../../../infrastructure/realtime/eventBroadcaster';
import { revalidatePath } from 'next/cache';
import type { Flight } from '../../../domain/flights/types';

export const dynamic = 'force-dynamic';

// GET all flights with caching
export async function GET() {
  try {
    const flights = await flightDB.getAll();
    const response = successResponse(flights);
    
    response.headers.set('Cache-Control', 'no-store');
    
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

// POST create new flight
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = validateSchema(CreateFlightSchema, body);
    const newFlight = await flightDB.create(validatedData as Partial<Flight>);

    try {
      revalidatePath('/api/flights');
    } catch (e) {
      console.warn('Cache revalidation failed:', e);
    }

    eventBroadcaster.broadcast({
      type: 'flight_updated',
      data: newFlight,
    });

    return successResponse(newFlight, HTTP_STATUS.CREATED);
  } catch (error) {
    return handleApiError(error);
  }
}
