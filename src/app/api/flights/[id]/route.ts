// API Route for single Flight operations (TypeScript)
import { NextResponse } from 'next/server';
import { flightDB } from '@/lib/db';
import type { Flight } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single flight by ID
export async function GET(_request: Request, { params }: RouteParams) {
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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT update flight
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: Partial<Flight> = await request.json();
    const updatedFlight = flightDB.update(id, body);
    
    if (!updatedFlight) {
      return NextResponse.json(
        { success: false, error: 'Flight not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: updatedFlight });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE flight
export async function DELETE(_request: Request, { params }: RouteParams) {
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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
