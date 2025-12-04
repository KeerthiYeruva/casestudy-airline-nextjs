// API Route for passenger check-in operations
import { NextResponse } from 'next/server';
import { passengerDB } from '@/lib/db';

// POST check-in passenger
export async function POST(request, { params }) {
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
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE undo check-in
export async function DELETE(request, { params }) {
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
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
