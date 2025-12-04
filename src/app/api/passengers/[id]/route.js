// API Route for single Passenger operations
import { NextResponse } from 'next/server';
import { passengerDB } from '@/lib/db';

// GET single passenger by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const passenger = passengerDB.getById(id);
    
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

// PUT update passenger
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedPassenger = passengerDB.update(id, body);
    
    if (!updatedPassenger) {
      return NextResponse.json(
        { success: false, error: 'Passenger not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: updatedPassenger });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE passenger
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const deletedPassenger = passengerDB.delete(id);
    
    if (!deletedPassenger) {
      return NextResponse.json(
        { success: false, error: 'Passenger not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: deletedPassenger });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
