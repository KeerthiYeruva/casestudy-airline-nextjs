// API Route for passenger seat change (TypeScript)
import { passengerDB } from '../../../../../infrastructure/persistence/db';
import { handleApiError, successResponse, notFoundResponse, badRequestResponse } from '../../../../../infrastructure/api/apiUtils';
import { SeatChangeSchema, validateSchema } from '../../../../../domain/validation/schemas';
import { eventBroadcaster } from '../../../../../infrastructure/realtime/eventBroadcaster';
import { revalidatePath } from 'next/cache';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

// PUT change passenger seat
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const validatedData = validateSchema(SeatChangeSchema, body);
    
    if (!validatedData.seat || !validatedData.seat.trim()) {
      return badRequestResponse('Seat number is required');
    }
    
    const result = await passengerDB.changeSeat(id, validatedData.seat.trim());
    
    if (!result) {
      return notFoundResponse('Passenger');
    }

    try {
      revalidatePath('/api/passengers');
      revalidatePath(`/api/passengers/${id}`);
      revalidatePath(`/api/passengers?flightId=${result.flightId}`);
    } catch (e) {
      console.warn('Cache revalidation failed:', e);
    }
    
    // Broadcast seat change to all connected clients
    eventBroadcaster.broadcast({
      type: 'seat_changed',
      data: result,
    });
    
    return successResponse(result);
  } catch (error) {
    return handleApiError(error);
  }
}
