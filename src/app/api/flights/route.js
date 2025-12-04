// API Route for Flights CRUD operations
import { NextResponse } from 'next/server';
import { flightDB } from '@/lib/db';

// GET all flights
export async function GET() {
  try {
    const flights = flightDB.getAll();
    return NextResponse.json({ success: true, data: flights });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new flight
export async function POST(request) {
  try {
    const body = await request.json();
    const newFlight = flightDB.create(body);
    return NextResponse.json({ success: true, data: newFlight }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
