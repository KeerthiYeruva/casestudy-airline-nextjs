// API Route for single Flight operations (TypeScript)
import { flightDB } from '@/lib/db';
import { handleApiError, successResponse, notFoundResponse } from '@/lib/apiUtils';
import { UpdateFlightSchema, validateSchema } from '@/lib/validationSchemas';
import type { Flight } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single flight by ID
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const flight = flightDB.getById(id);
    
    if (!flight) {
      return notFoundResponse('Flight');
    }
    
    return successResponse(flight);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update flight
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = validateSchema(UpdateFlightSchema, body);
    const updatedFlight = flightDB.update(id, validatedData as Partial<Flight>);
    
    if (!updatedFlight) {
      return notFoundResponse('Flight');
    }
    
    return successResponse(updatedFlight);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE flight
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deletedFlight = flightDB.delete(id);
    
    if (!deletedFlight) {
      return notFoundResponse('Flight');
    }
    
    return successResponse(deletedFlight);
  } catch (error) {
    return handleApiError(error);
  }
}
