// API Route for passenger check-in operations (TypeScript)
import { NextResponse } from 'next/server';
import { passengerDB } from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// POST check-in passenger
export async function POST(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const passenger = passengerDB.checkIn(id);
    
    if (!passenger) {
      return NextResponse.json(
        { success: false, error: 'Passenger not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: passenger });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE undo check-in
export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const passenger = passengerDB.undoCheckIn(id);
    
    if (!passenger) {
      return NextResponse.json(
        { success: false, error: 'Passenger not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: passenger });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
