// API Route for single Passenger operations (TypeScript)
import { passengerDB } from '@/lib/db';
import { handleApiError, successResponse, notFoundResponse } from '@/lib/apiUtils';
import { UpdatePassengerSchema, validateSchema } from '@/lib/validationSchemas';
import { eventBroadcaster } from '@/lib/eventBroadcaster';
import { revalidatePath } from 'next/cache';
import type { Passenger } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single passenger by ID with caching
export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const passenger = await passengerDB.getById(id);
    
    if (!passenger) {
      return notFoundResponse('Passenger');
    }
    
    const response = successResponse(passenger);
    response.headers.set(
      'Cache-Control',
      'public, s-maxage=30, stale-while-revalidate=60'
    );
    
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update passenger with cache revalidation
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    console.log('🔍 Updating passenger:', id, 'with data:', body);
    const validatedData = validateSchema(UpdatePassengerSchema, body);
    console.log('✅ Validated data:', validatedData);
    const updatedPassenger = await passengerDB.update(id, validatedData as Partial<Passenger>);
    console.log('💾 Updated passenger in DB:', updatedPassenger);
    
    if (!updatedPassenger) {
      return notFoundResponse('Passenger');
    }
    
    // Revalidate cache
    try {
      revalidatePath('/api/passengers');
      revalidatePath(`/api/passengers/${id}`);
    } catch (e) {
      console.warn('Cache revalidation failed:', e);
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

// DELETE passenger with cache revalidation
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deletedPassenger = await passengerDB.delete(id);
    
    if (!deletedPassenger) {
      return notFoundResponse('Passenger');
    }
    
    // Revalidate cache
    try {
      revalidatePath('/api/passengers');
      revalidatePath(`/api/passengers/${id}`);
    } catch (e) {
      console.warn('Cache revalidation failed:', e);
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
