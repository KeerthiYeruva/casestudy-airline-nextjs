// API Route for resetting data to initial state
import { NextResponse } from 'next/server';
import { resetDatabase } from '@/lib/db';

// POST reset database to initial state
export async function POST() {
  try {
    // Reset server-side data
    resetDatabase();
    
    // Return success - frontend will handle its own localStorage via Zustand
    return NextResponse.json({ 
      success: true, 
      message: 'Database reset to initial state successfully',
      clearStorage: true // Signal to frontend to clear its persist storage
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 }
    );
  }
}
