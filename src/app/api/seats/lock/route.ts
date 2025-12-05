// Seat lock API endpoints for conflict prevention
import { NextRequest } from 'next/server';
import { eventBroadcaster } from '@/lib/eventBroadcaster';
import { successResponse, handleApiError, badRequestResponse } from '@/lib/apiUtils';

export const dynamic = 'force-dynamic';

/**
 * POST /api/seats/lock - Lock a seat for editing
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { seatId, userId } = body;

    if (!seatId || !userId) {
      return badRequestResponse('seatId and userId are required');
    }

    const locked = eventBroadcaster.lockSeat(seatId, userId);

    if (!locked) {
      return successResponse({ 
        success: false, 
        message: 'Seat is currently locked by another user' 
      }, 409);
    }

    return successResponse({ 
      success: true, 
      seatId, 
      userId,
      expiresAt: Date.now() + 30000 
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * DELETE /api/seats/lock - Unlock a seat
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const seatId = searchParams.get('seatId');
    const userId = searchParams.get('userId');

    if (!seatId || !userId) {
      return badRequestResponse('seatId and userId are required');
    }

    eventBroadcaster.unlockSeat(seatId, userId);

    return successResponse({ 
      success: true, 
      message: 'Seat unlocked successfully' 
    });
  } catch (error) {
    return handleApiError(error);
  }
}

/**
 * GET /api/seats/lock - Get all locked seats
 */
export async function GET() {
  try {
    const lockedSeats = eventBroadcaster.getLockedSeats();
    
    return successResponse({ 
      lockedSeats,
      count: lockedSeats.length 
    });
  } catch (error) {
    return handleApiError(error);
  }
}
