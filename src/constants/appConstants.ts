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

// Flight Status Options
export const FLIGHT_STATUS = {
  ON_TIME: 'On Time',
  DELAYED: 'Delayed',
  BOARDING: 'Boarding',
  DEPARTED: 'Departed',
  CANCELLED: 'Cancelled',
} as const;

export type FlightStatus = typeof FLIGHT_STATUS[keyof typeof FLIGHT_STATUS];

// Validation Limits
export const VALIDATION_LIMITS = {
  PASSENGER_NAME_MIN: 2,
  PASSENGER_NAME_MAX: 100,
  BOOKING_REFERENCE_MIN: 6,
  BOOKING_REFERENCE_MAX: 10,
  PASSPORT_NUMBER_MIN: 6,
  PASSPORT_NUMBER_MAX: 20,
  ADDRESS_MAX: 200,
  ITEM_NAME_MAX: 100,
  SHOP_ITEM_MIN_QUANTITY: 1,
  SHOP_ITEM_MIN_PRICE: 0.01,
} as const;

// Currency Codes
export const CURRENCIES = {
  USD: 'USD',
  EUR: 'EUR',
  GBP: 'GBP',
  JPY: 'JPY',
} as const;

export type Currency = typeof CURRENCIES[keyof typeof CURRENCIES];

// Default Currency
export const DEFAULT_CURRENCY = CURRENCIES.USD;

// Meal Options
export const DEFAULT_MEAL_OPTIONS = [
  'Regular',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Diabetic',
  'Kosher',
  'Halal',
  'Low Sodium',
  'Child Meal',
  'Fruit Platter',
] as const;

// Ancillary Services
export const DEFAULT_ANCILLARY_SERVICES = [
  'Priority Boarding',
  'Extra Baggage',
  'Wheelchair Assistance',
  'Infant Care Kit',
  'Wi-Fi Access',
  'Extra Legroom',
  'Lounge Access',
  'Fast Track Security',
  'Pet Care',
  'Sports Equipment',
] as const;
