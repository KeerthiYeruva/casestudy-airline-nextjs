import { shopDB } from '../../../infrastructure/persistence/db';
import { handleApiError, successResponse, HTTP_STATUS } from '../../../infrastructure/api/apiUtils';
import { CreateShopItemSchema, validateSchema } from '../../../domain/validation/schemas';
import { eventBroadcaster } from '../../../infrastructure/realtime/eventBroadcaster';
import { revalidatePath } from 'next/cache';
import type { ShopItem } from '../../../domain/services/types';

export const dynamic = 'force-dynamic';

const revalidateShop = () => {
  try {
    revalidatePath('/api/shop');
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

export async function GET() {
  try {
    const response = successResponse(shopDB.getAll());
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validatedData = validateSchema(CreateShopItemSchema, body);
    const newItem: ShopItem = {
      id: body.id || `SHOP${Date.now()}`,
      ...validatedData,
    };

    const createdItem = shopDB.add(newItem);
    revalidateShop();
    broadcastShop();

    return successResponse(createdItem, HTTP_STATUS.CREATED);
  } catch (error) {
    return handleApiError(error);
  }
}
