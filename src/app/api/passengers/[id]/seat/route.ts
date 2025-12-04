// API Route for passenger seat change (TypeScript)
import { NextResponse } from 'next/server';
import { passengerDB } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

interface SeatChangeBody {
  seat: string;
}

// PUT change passenger seat
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const { seat }: SeatChangeBody = await request.json();
    
    const result = passengerDB.changeSeat(id, seat);
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Passenger not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
