// API Route for passenger seat change
import { NextResponse } from 'next/server';
import { passengerDB } from '@/lib/db';

// PUT change passenger seat
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const { seat } = await request.json();
    
    const result = passengerDB.changeSeat(id, seat);
    
    if (!result) {
      return NextResponse.json(
        { success: false, error: 'Passenger not found' },
        { status: 404 }
      );
    }
    
    if (result.error) {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 400 }
      );
    }
    
    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
