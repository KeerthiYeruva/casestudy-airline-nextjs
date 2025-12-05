// API Route for Flights CRUD operations (TypeScript)
import { flightDB } from '@/lib/db';
import { handleApiError, successResponse, HTTP_STATUS } from '@/lib/apiUtils';
import { CreateFlightSchema, validateSchema } from '@/lib/validationSchemas';
import type { Flight } from '@/types';

// Enable caching for this route
export const dynamic = 'force-static';
export const revalidate = 60; // Revalidate every 60 seconds

// GET all flights with caching
export async function GET() {
  try {
    const flights = await flightDB.getAll();
    const response = successResponse(flights);
    
    // Add cache control headers
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=60, stale-while-revalidate=120'
    );
    
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
    return successResponse(newFlight, HTTP_STATUS.CREATED);
  } catch (error) {
    return handleApiError(error);
  }
}
