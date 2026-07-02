import type { Passenger } from '../../domain/passengers/types';
import type { ShopItem } from '../../domain/services/types';

export interface PassengerFormData extends Omit<Passenger, 'id'> {
  id?: string;
}

export interface ShopItemFormData extends Omit<ShopItem, 'id'> {
  id?: string;
}
