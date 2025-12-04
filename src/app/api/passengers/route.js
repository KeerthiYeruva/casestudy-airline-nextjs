// API Route for Passengers CRUD operations
import { NextResponse } from 'next/server';
import { passengerDB } from '@/lib/db';

// GET all passengers or filter by flightId
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const flightId = searchParams.get('flightId');
    
    let passengers;
    if (flightId) {
      passengers = passengerDB.getByFlightId(flightId);
    } else {
      passengers = passengerDB.getAll();
    }
    
    return NextResponse.json({ success: true, data: passengers });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST create new passenger
export async function POST(request) {
  try {
    const body = await request.json();
    const newPassenger = passengerDB.create(body);
    return NextResponse.json({ success: true, data: newPassenger }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
