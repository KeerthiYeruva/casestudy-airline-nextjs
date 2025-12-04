// API Route for Passengers CRUD operations (TypeScript)
import { NextResponse } from 'next/server';
import { passengerDB } from '@/lib/db';
import type { Passenger } from '@/types';

// GET all passengers or filter by flightId
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const flightId = searchParams.get('flightId');
    
    let passengers: Passenger[];
    if (flightId) {
      passengers = passengerDB.getByFlightId(flightId);
    } else {
      passengers = passengerDB.getAll();
    }
    
    return NextResponse.json({ success: true, data: passengers });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST create new passenger
export async function POST(request: Request) {
  try {
    const body: Partial<Passenger> = await request.json();
    const newPassenger = passengerDB.create(body);
    return NextResponse.json({ success: true, data: newPassenger }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
