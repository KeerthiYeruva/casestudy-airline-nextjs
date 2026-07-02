import { serviceDB } from '../../../infrastructure/persistence/db';
import { badRequestResponse, handleApiError, notFoundResponse, successResponse, HTTP_STATUS } from '../../../infrastructure/api/apiUtils';
import { eventBroadcaster } from '../../../infrastructure/realtime/eventBroadcaster';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const getTrimmedValue = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const revalidateServices = () => {
  try {
    revalidatePath('/api/services');
  } catch (e) {
    console.warn('Cache revalidation failed:', e);
  }
};

const broadcastServices = () => {
  eventBroadcaster.broadcast({
    type: 'catalog_updated',
    data: { catalog: 'services' },
  });
};

export async function GET() {
  try {
    const response = successResponse(serviceDB.getAll());
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const service = getTrimmedValue(body.service);

    if (!service) {
      return badRequestResponse('Service name is required');
    }

    const createdService = serviceDB.add(service);
    revalidateServices();
    broadcastServices();

    return successResponse(createdService, HTTP_STATUS.CREATED);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const oldService = getTrimmedValue(body.oldService);
    const newService = getTrimmedValue(body.newService);

    if (!oldService || !newService) {
      return badRequestResponse('oldService and newService are required');
    }

    const updatedService = serviceDB.update(oldService, newService);
    if (!updatedService) {
      return notFoundResponse('Service');
    }

    revalidateServices();
    broadcastServices();

    return successResponse(updatedService);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const service = getTrimmedValue(body.service);

    if (!service) {
      return badRequestResponse('Service name is required');
    }

    const deletedService = serviceDB.remove(service);
    if (!deletedService) {
      return notFoundResponse('Service');
    }

    revalidateServices();
    broadcastServices();

    return successResponse(deletedService);
  } catch (error) {
    return handleApiError(error);
  }
}
