// API Route for single Passenger operations (TypeScript)
import { NextResponse } from 'next/server';
import { passengerDB } from '@/lib/db';
import type { Passenger } from '@/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET single passenger by ID
export async function GET(_request: Request, { params }: RouteParams) {
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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// PUT update passenger
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body: Partial<Passenger> = await request.json();
    const updatedPassenger = passengerDB.update(id, body);
    
    if (!updatedPassenger) {
      return NextResponse.json(
        { success: false, error: 'Passenger not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ success: true, data: updatedPassenger });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}

// DELETE passenger
export async function DELETE(_request: Request, { params }: RouteParams) {
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
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
