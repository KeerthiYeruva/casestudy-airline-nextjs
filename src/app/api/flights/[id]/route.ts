// API Route for single Flight operations (TypeScript)
import { flightDB } from '../../../../lib/db';
import { handleApiError, successResponse, notFoundResponse } from '../../../../lib/apiUtils';
import { UpdateFlightSchema, validateSchema } from '../../../../lib/validationSchemas';
import { eventBroadcaster } from '../../../../lib/eventBroadcaster';
import { revalidatePath } from 'next/cache';
import type { Flight } from '../../../../types/flight';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

// GET single flight by ID
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const flight = await flightDB.getById(id);
    
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
    const updatedFlight = await flightDB.update(id, validatedData as Partial<Flight>);
    
    if (!updatedFlight) {
      return notFoundResponse('Flight');
    }

    try {
      revalidatePath('/api/flights');
      revalidatePath(`/api/flights/${id}`);
    } catch (e) {
      console.warn('Cache revalidation failed:', e);
    }

    eventBroadcaster.broadcast({
      type: 'flight_updated',
      data: updatedFlight,
    });
    
    return successResponse(updatedFlight);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE flight
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deletedFlight = await flightDB.delete(id);
    
    if (!deletedFlight) {
      return notFoundResponse('Flight');
    }

    try {
      revalidatePath('/api/flights');
      revalidatePath(`/api/flights/${id}`);
      revalidatePath('/api/passengers');
    } catch (e) {
      console.warn('Cache revalidation failed:', e);
    }

    eventBroadcaster.broadcast({
      type: 'flight_updated',
      data: deletedFlight,
    });
    
    return successResponse(deletedFlight);
  } catch (error) {
    return handleApiError(error);
  }
}
