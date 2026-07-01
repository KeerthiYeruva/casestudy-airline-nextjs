export type AncillaryService = string;
export type MealOption = string;
export type ShopCategory = string;

export interface ShopRequest {
  itemId: string;
  itemName: string;
  category: string;
  price: number;
  quantity: number;
  currency: string;
}

export interface ShopItem {
  id: string;
  name: string;
  category: string;
  price: number;
  currency: string;
  description?: string;
  image?: string;
}
