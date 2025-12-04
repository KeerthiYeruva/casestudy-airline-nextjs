// Shop Categories
export const SHOP_CATEGORIES = [
  'Perfumes & Cosmetics',
  'Electronics',
  'Fashion & Accessories',
  'Food & Beverages',
  'Travel Essentials',
  'Toys & Gifts',
];

// Seat Configuration
export const SEAT_ROWS = 10;
export const SEAT_LETTERS = ['A', 'B', 'C', 'D', 'E', 'F'];
export const AISLE_POSITION = 2; // After seat C

// Default Form Values
export const DEFAULT_PASSENGER = {
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

export const DEFAULT_SHOP_ITEM = {
  name: '',
  category: 'Perfumes & Cosmetics',
  price: 0,
  currency: 'USD',
};
