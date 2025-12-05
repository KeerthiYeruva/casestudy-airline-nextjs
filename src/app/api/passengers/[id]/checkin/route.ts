// API Route for passenger check-in operations (TypeScript)
import { passengerDB } from '@/lib/db';
import { handleApiError, successResponse, notFoundResponse } from '@/lib/apiUtils';
import { eventBroadcaster } from '@/lib/eventBroadcaster';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST check-in passenger
export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const passenger = passengerDB.checkIn(id);
    
    if (!passenger) {
      return notFoundResponse('Passenger');
    }
    
    // Broadcast check-in to all connected clients
    eventBroadcaster.broadcast({
      type: 'passenger_checked_in',
      data: passenger,
    });
    
    return successResponse(passenger);
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE undo check-in
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const passenger = passengerDB.undoCheckIn(id);
    
    if (!passenger) {
      return notFoundResponse('Passenger');
    }
    
    // Broadcast undo check-in to all connected clients
    eventBroadcaster.broadcast({
      type: 'passenger_checked_in',
      data: passenger,
    });
    
    return successResponse(passenger);
  } catch (error) {
    return handleApiError(error);
  }
}
