// API Route for resetting data to initial state
import { resetDatabase } from '@/lib/db';
import { handleApiError, successResponse } from '@/lib/apiUtils';

// POST reset database to initial state
export async function POST() {
  try {
    // Reset server-side data
    await resetDatabase();
    
    // Return success - frontend will handle its own localStorage via Zustand
    return successResponse({ 
      message: 'Database reset to initial state successfully',
      clearStorage: true // Signal to frontend to clear its persist storage
    });
  } catch (error) {
    return handleApiError(error);
  }
}
