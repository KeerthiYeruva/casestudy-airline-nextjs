// API Route for passenger check-in operations (TypeScript)
import { passengerDB } from '@/lib/db';
import { handleApiError, successResponse, notFoundResponse } from '@/lib/apiUtils';

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
    
    return successResponse(passenger);
  } catch (error) {
    return handleApiError(error);
  }
}
