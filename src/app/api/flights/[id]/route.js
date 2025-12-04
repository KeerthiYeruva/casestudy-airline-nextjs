// API Route for single Flight operations
import { NextResponse } from 'next/server';
import { flightDB } from '@/lib/db';

// GET single flight by ID
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const flight = flightDB.getById(id);
    
    if (!flight) {
      return NextResponse.json(
        { success: false, error: 'Flight not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: flight });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT update flight
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const updatedFlight = flightDB.update(id, body);
    
    if (!updatedFlight) {
      return NextResponse.json(
        { success: false, error: 'Flight not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: updatedFlight });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE flight
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const deletedFlight = flightDB.delete(id);
    
    if (!deletedFlight) {
      return NextResponse.json(
        { success: false, error: 'Flight not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: deletedFlight });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
