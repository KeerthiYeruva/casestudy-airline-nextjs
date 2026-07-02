import { shopDB } from '../../../../infrastructure/persistence/db';
import { handleApiError, notFoundResponse, successResponse } from '../../../../infrastructure/api/apiUtils';
import { UpdateShopItemSchema, validateSchema } from '../../../../domain/validation/schemas';
import { eventBroadcaster } from '../../../../infrastructure/realtime/eventBroadcaster';
import { revalidatePath } from 'next/cache';
import type { ShopItem } from '../../../../domain/services/types';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

const revalidateShop = (id: string) => {
  try {
    revalidatePath('/api/shop');
    revalidatePath(`/api/shop/${id}`);
  } catch (e) {
    console.warn('Cache revalidation failed:', e);
  }
};

const broadcastShop = () => {
  eventBroadcaster.broadcast({
    type: 'catalog_updated',
    data: { catalog: 'shop' },
  });
};

export async function GET(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const item = shopDB.getById(id);

    if (!item) {
      return notFoundResponse('Shop item');
    }

    const response = successResponse(item);
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = validateSchema(UpdateShopItemSchema, body);
    const updatedItem = shopDB.update(id, validatedData as Partial<ShopItem>);

    if (!updatedItem) {
      return notFoundResponse('Shop item');
    }

    revalidateShop(id);
    broadcastShop();

    return successResponse(updatedItem);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const deletedItem = shopDB.delete(id);

    if (!deletedItem) {
      return notFoundResponse('Shop item');
    }

    revalidateShop(id);
    broadcastShop();

    return successResponse(deletedItem);
  } catch (error) {
    return handleApiError(error);
  }
}
