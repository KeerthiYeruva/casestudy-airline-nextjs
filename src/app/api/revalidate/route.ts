import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

/**
 * API Route for On-Demand Revalidation
 * 
 * Allows invalidating specific cache paths after data mutations.
 * This ensures data consistency across Server Components.
 * 
 * POST /api/revalidate
 * Body: { paths: string[] }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { paths } = body;

    if (!paths || !Array.isArray(paths)) {
      return NextResponse.json(
        { error: 'Invalid paths parameter' },
        { status: 400 }
      );
    }

    // Revalidate each path
    paths.forEach((path: string) => {
      try {
        revalidatePath(path);
      } catch (e) {
        console.warn(`Failed to revalidate path ${path}:`, e);
      }
    });

    return NextResponse.json({ 
      revalidated: true, 
      paths,
      now: Date.now() 
    });
  } catch (error) {
    console.error('Revalidation error:', error);
    return NextResponse.json(
      { error: 'Failed to revalidate' },
      { status: 500 }
    );
  }
}
