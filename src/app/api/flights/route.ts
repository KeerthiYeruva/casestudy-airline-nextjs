// API Route for Flights CRUD operations (TypeScript)
import { NextResponse } from 'next/server';
import { flightDB } from '@/lib/db';
import type { Flight } from '@/types';

// GET all flights
export async function GET() {
  try {
    const flights = flightDB.getAll();
    return NextResponse.json({ success: true, data: flights });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// POST create new flight
export async function POST(request: Request) {
  try {
    const body: Partial<Flight> = await request.json();
    const newFlight = flightDB.create(body);
    return NextResponse.json({ success: true, data: newFlight }, { status: 201 });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
