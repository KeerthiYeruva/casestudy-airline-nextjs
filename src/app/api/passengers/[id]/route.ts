// API Route for single Passenger operations (TypeScript)
import { passengerDB } from '@/lib/db';
import { handleApiError, successResponse, notFoundResponse } from '@/lib/apiUtils';
import { UpdatePassengerSchema, validateSchema } from '@/lib/validationSchemas';
import { eventBroadcaster } from '@/lib/eventBroadcaster';
import type { Passenger } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single passenger by ID
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const passenger = passengerDB.getById(id);
    
    if (!passenger) {
      return notFoundResponse('Passenger');
    }
    
    return successResponse(passenger);
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update passenger
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = validateSchema(UpdatePassengerSchema, body);
    const updatedPassenger = passengerDB.update(id, validatedData as Partial<Passenger>);
    
    if (!updatedPassenger) {
      return notFoundResponse('Passenger');
    }
    
    // Broadcast update to all connected clients
    eventBroadcaster.broadcast({
      type: 'passenger_updated',
      data: updatedPassenger,
    });
    
    return successResponse(updatedPassenger);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE passenger
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deletedPassenger = passengerDB.delete(id);
    
    if (!deletedPassenger) {
      return notFoundResponse('Passenger');
    }
    
    // Broadcast deletion to all connected clients
    eventBroadcaster.broadcast({
      type: 'passenger_deleted',
      data: deletedPassenger,
    });
    
    return successResponse(deletedPassenger);
  } catch (error) {
    return handleApiError(error);
  }
}
