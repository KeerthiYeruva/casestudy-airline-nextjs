// API Route for Flights CRUD operations (TypeScript)
import { flightDB } from '@/lib/db';
import { handleApiError, successResponse, HTTP_STATUS } from '@/lib/apiUtils';
import { CreateFlightSchema, validateSchema } from '@/lib/validationSchemas';
import type { Flight } from '@/types';

// GET all flights
export async function GET() {
  try {
    const flights = await flightDB.getAll();
    return successResponse(flights);
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
