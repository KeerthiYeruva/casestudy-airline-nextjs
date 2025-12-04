// TypeScript constants for the Airline Management System

import type { Passenger, ShopItem } from '@/types';

// Shop Categories
export const SHOP_CATEGORIES = [
  'Perfumes & Cosmetics',
  'Electronics',
  'Fashion & Accessories',
  'Food & Beverages',
  'Travel Essentials',
  'Toys & Gifts',
] as const;

export type ShopCategory = typeof SHOP_CATEGORIES[number];

// Seat Configuration
export const SEAT_ROWS = 10;
export const SEAT_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'] as const;
export const AISLE_POSITION = 2; // After seat C

// Default Form Values
export const DEFAULT_PASSENGER: Partial<Passenger> = {
  passport: { number: '', expiryDate: '', country: '' },
  address: '',
  dateOfBirth: '',
  ancillaryServices: [],
  specialMeal: 'Regular',
  wheelchair: false,
  infant: false,
  checkedIn: false,
  shopRequests: [],
};

export const DEFAULT_SHOP_ITEM: Partial<ShopItem> = {
  name: '',
  category: 'Perfumes & Cosmetics',
  price: 0,
  currency: 'USD',
};
