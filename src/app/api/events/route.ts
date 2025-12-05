// SSE API Route for real-time updates
import { NextRequest } from 'next/server';
import { eventBroadcaster } from '@/lib/eventBroadcaster';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  // Get user ID from query params or headers
  const userId = request.nextUrl.searchParams.get('userId') || 'anonymous';
  const clientId = `${userId}-${Date.now()}-${Math.random().toString(36).substring(7)}`;

  // Create a readable stream for SSE
  const stream = new ReadableStream({
    start(controller) {
      // Add client to broadcaster
      eventBroadcaster.addClient(clientId, controller, userId);

      // Send initial connection message
      const encoder = new TextEncoder();
      const welcome = `data: ${JSON.stringify({ 
        type: 'connected', 
        clientId, 
        userId,
        timestamp: Date.now() 
      })}\n\n`;
      controller.enqueue(encoder.encode(welcome));

      // Keep-alive ping every 15 seconds
      const keepAliveInterval = setInterval(() => {
        try {
          const ping = `: keep-alive ${Date.now()}\n\n`;
          controller.enqueue(encoder.encode(ping));
        } catch (error) {
          console.error('[SSE] Keep-alive error:', error);
          clearInterval(keepAliveInterval);
          eventBroadcaster.removeClient(clientId);
        }
      }, 15000);

      // Handle client disconnect
      request.signal.addEventListener('abort', () => {
        console.log(`[SSE] Client ${clientId} aborted connection`);
        clearInterval(keepAliveInterval);
        eventBroadcaster.removeClient(clientId);
        try {
          controller.close();
        } catch {
          // Controller might already be closed - ignore error
        }
      });
    },
  });

  // Return SSE response
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no', // Disable buffering for nginx
    },
  });
}
