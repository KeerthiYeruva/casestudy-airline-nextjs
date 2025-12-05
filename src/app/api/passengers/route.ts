// API Route for Passengers CRUD operations (TypeScript)
import { passengerDB } from '@/lib/db';
import { handleApiError, successResponse, HTTP_STATUS } from '@/lib/apiUtils';
import { CreatePassengerSchema, validateSchema } from '@/lib/validationSchemas';
import type { Passenger } from '@/types';

// GET all passengers or filter by flightId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const flightId = searchParams.get('flightId');
    
    let passengers: Passenger[];
    if (flightId) {
      passengers = passengerDB.getByFlightId(flightId);
    } else {
      passengers = passengerDB.getAll();
    }
    
    return successResponse(passengers);
  } catch (error) {
    return handleApiError(error);
  }
}

// POST create new passenger
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = validateSchema(CreatePassengerSchema, body);
    const newPassenger = passengerDB.create(validatedData as Partial<Passenger>);
    return successResponse(newPassenger, HTTP_STATUS.CREATED);
  } catch (error) {
    return handleApiError(error);
  }
}
