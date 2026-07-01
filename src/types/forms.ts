import type { Passenger } from './passenger';
import type { ShopItem } from './services';

export interface PassengerFormData extends Omit<Passenger, 'id'> {
  id?: string;
}

export interface ShopItemFormData extends Omit<ShopItem, 'id'> {
  id?: string;
}
