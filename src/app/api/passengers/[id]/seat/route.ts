// API Route for passenger seat change (TypeScript)
import { passengerDB } from '@/lib/db';
import { handleApiError, successResponse, notFoundResponse, badRequestResponse } from '@/lib/apiUtils';
import { SeatChangeSchema, validateSchema } from '@/lib/validationSchemas';
import { eventBroadcaster } from '@/lib/eventBroadcaster';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// PUT change passenger seat
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    const validatedData = validateSchema(SeatChangeSchema, body);
    
    if (!validatedData.seat || !validatedData.seat.trim()) {
      return badRequestResponse('Seat number is required');
    }
    
    const result = passengerDB.changeSeat(id, validatedData.seat.trim());
    
    if (!result) {
      return notFoundResponse('Passenger');
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
