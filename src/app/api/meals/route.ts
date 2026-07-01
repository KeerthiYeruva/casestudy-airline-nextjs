import { mealDB } from '@/lib/db';
import { badRequestResponse, handleApiError, notFoundResponse, successResponse, HTTP_STATUS } from '@/lib/apiUtils';
import { eventBroadcaster } from '@/lib/eventBroadcaster';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

const getTrimmedValue = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const revalidateMeals = () => {
  try {
    revalidatePath('/api/meals');
  } catch (e) {
    console.warn('Cache revalidation failed:', e);
  }
};

const broadcastMeals = () => {
  eventBroadcaster.broadcast({
    type: 'catalog_updated',
    data: { catalog: 'meals' },
  });
};

export async function GET() {
  try {
    const response = successResponse(mealDB.getAll());
    response.headers.set('Cache-Control', 'no-store');
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const meal = getTrimmedValue(body.meal);

    if (!meal) {
      return badRequestResponse('Meal option name is required');
    }

    const createdMeal = mealDB.add(meal);
    revalidateMeals();
    broadcastMeals();

    return successResponse(createdMeal, HTTP_STATUS.CREATED);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const oldMeal = getTrimmedValue(body.oldMeal);
    const newMeal = getTrimmedValue(body.newMeal);

    if (!oldMeal || !newMeal) {
      return badRequestResponse('oldMeal and newMeal are required');
    }

    const updatedMeal = mealDB.update(oldMeal, newMeal);
    if (!updatedMeal) {
      return notFoundResponse('Meal option');
    }

    revalidateMeals();
    broadcastMeals();

    return successResponse(updatedMeal);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const meal = getTrimmedValue(body.meal);

    if (!meal) {
      return badRequestResponse('Meal option name is required');
    }

    const deletedMeal = mealDB.remove(meal);
    if (!deletedMeal) {
      return notFoundResponse('Meal option');
    }

    revalidateMeals();
    broadcastMeals();

    return successResponse(deletedMeal);
  } catch (error) {
    return handleApiError(error);
  }
}
