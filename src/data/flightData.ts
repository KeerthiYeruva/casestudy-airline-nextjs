// TypeScript mock data for flights and passengers
import type { Flight, Passenger, ShopItem } from '@/types';

export const flights: Flight[] = [
  { 
    id: 'FL001',
    name: 'Flight AA101',
    flightNumber: 'AA101',
    origin: 'New York (JFK)',
    destination: 'Los Angeles (LAX)',
    from: 'New York (JFK)',
    to: 'Los Angeles (LAX)',
    departureTime: '10:00 AM',
    arrivalTime: '01:30 PM',
    time: '10:00 AM',
    date: '2025-12-03',
    status: 'On Time',
    aircraft: 'Boeing 737',
    gate: 'A12',
    terminal: '4',
    totalSeats: 180,
    availableSeats: 172
  },
  { 
    id: 'FL002',
    name: 'Flight BB202',
    flightNumber: 'BB202',
    origin: 'Chicago (ORD)',
    destination: 'Miami (MIA)',
    from: 'Chicago (ORD)',
    to: 'Miami (MIA)',
    departureTime: '12:30 PM',
    arrivalTime: '04:45 PM',
    time: '12:30 PM',
    date: '2025-12-03',
    status: 'Boarding',
    aircraft: 'Airbus A320',
    gate: 'B5',
    terminal: '2',
    totalSeats: 150,
    availableSeats: 144
  },
  { 
    id: 'FL003',
    name: 'Flight CC303',
    flightNumber: 'CC303',
    origin: 'San Francisco (SFO)',
    destination: 'Seattle (SEA)',
    from: 'San Francisco (SFO)',
    to: 'Seattle (SEA)',
    departureTime: '03:15 PM',
    arrivalTime: '05:45 PM',
    time: '03:15 PM',
    date: '2025-12-03',
    status: 'On Time',
    aircraft: 'Boeing 787',
    gate: 'C8',
    terminal: '1',
    totalSeats: 200,
    availableSeats: 194
  },
  { 
    id: 'FL004',
    name: 'Flight DD404',
    flightNumber: 'DD404',
    origin: 'Boston (BOS)',
    destination: 'Denver (DEN)',
    from: 'Boston (BOS)',
    to: 'Denver (DEN)',
    departureTime: '06:45 AM',
    arrivalTime: '09:30 AM',
    time: '06:45 AM',
    date: '2025-12-04',
    status: 'Delayed',
    aircraft: 'Boeing 737 MAX',
    gate: 'D10',
    terminal: '3',
    totalSeats: 172,
    availableSeats: 165
  },
  { 
    id: 'FL005',
    name: 'Flight EE505',
    flightNumber: 'EE505',
    origin: 'Dallas (DFW)',
    destination: 'Atlanta (ATL)',
    from: 'Dallas (DFW)',
    to: 'Atlanta (ATL)',
    departureTime: '02:20 PM',
    arrivalTime: '05:40 PM',
    time: '02:20 PM',
    date: '2025-12-04',
    status: 'On Time',
    aircraft: 'Airbus A321',
    gate: 'E15',
    terminal: '5',
    totalSeats: 190,
    availableSeats: 182
  },
  { 
    id: 'FL006',
    name: 'Flight FF606',
    flightNumber: 'FF606',
    origin: 'Las Vegas (LAS)',
    destination: 'Phoenix (PHX)',
    from: 'Las Vegas (LAS)',
    to: 'Phoenix (PHX)',
    departureTime: '08:00 PM',
    arrivalTime: '09:15 PM',
    time: '08:00 PM',
    date: '2025-12-04',
    status: 'Departed',
    aircraft: 'Boeing 737',
    gate: 'F22',
    terminal: '1',
    totalSeats: 160,
    availableSeats: 0
  },
  { 
    id: 'FL007',
    name: 'Flight GG707',
    flightNumber: 'GG707',
    origin: 'Orlando (MCO)',
    destination: 'New York (JFK)',
    from: 'Orlando (MCO)',
    to: 'New York (JFK)',
    departureTime: '11:30 AM',
    arrivalTime: '02:10 PM',
    time: '11:30 AM',
    date: '2025-12-05',
    status: 'Cancelled',
    aircraft: 'Airbus A320',
    gate: 'G8',
    terminal: '2',
    totalSeats: 150,
    availableSeats: 150
  },
];

export const passengers: Passenger[] = [
  // Flight FL001 passengers - Various missing information scenarios
  { 
    id: 'P001', 
    name: 'John Smith', 
    seat: '1A', 
    flightId: 'FL001',
    checkedIn: false,
    wheelchair: true,
    infant: false,
    ancillaryServices: ['Wheelchair Assistance', 'Priority Boarding'],
    specialMeal: 'Vegetarian',
    bookingReference: 'ABC123',
    passport: { number: 'US123456789', expiryDate: '2028-05-15', country: 'USA' },
    address: '123 Main St, New York, NY 10001',
    dateOfBirth: '1985-03-20',
    shopRequests: [
      { itemId: 'SHOP017', itemName: 'Travel Pillow Set', category: 'Travel Essentials', quantity: 1, price: 29.99, currency: 'USD' },
      { itemId: 'SHOP013', itemName: 'Swiss Chocolate Box', category: 'Food & Beverages', quantity: 2, price: 19.99, currency: 'USD' }
    ]
  },
  { 
    id: 'P002', 
    name: 'Sarah Johnson', 
    seat: '1B', 
    flightId: 'FL001',
    checkedIn: true,
    wheelchair: false,
    infant: true,
    ancillaryServices: ['Extra Baggage', 'Infant Care Kit'],
    specialMeal: 'Regular',
    bookingReference: 'ABC124',
    passport: { number: '', expiryDate: '', country: '' }, // Missing passport only
    address: '456 Oak Ave, Los Angeles, CA 90001',
    dateOfBirth: '1990-07-14',
    shopRequests: [{ itemId: 'SHOP001', itemName: 'Perfume - Chanel No. 5', category: 'Perfumes & Cosmetics', quantity: 1, price: 89.99, currency: 'USD' }]
  },
  { 
    id: 'P003', 
    name: 'Michael Brown', 
    seat: '2A', 
    flightId: 'FL001',
    checkedIn: false,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Extra Legroom'],
    specialMeal: 'Gluten-Free',
    bookingReference: 'ABC125',
    passport: { number: 'CA987654321', expiryDate: '2027-11-30', country: 'Canada' },
    address: '', // Missing address only
    dateOfBirth: '1988-09-10',
    shopRequests: [
      { itemId: 'SHOP005', itemName: 'Wireless Headphones - Sony', category: 'Electronics', quantity: 1, price: 199.99, currency: 'USD' }
    ]
  },
  { 
    id: 'P004', 
    name: 'Emily Davis', 
    seat: '2B', 
    flightId: 'FL001',
    checkedIn: true,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Priority Boarding', 'Extra Baggage'],
    specialMeal: 'Vegan',
    bookingReference: 'ABC126',
    passport: { number: 'GB456789123', expiryDate: '2029-02-20', country: 'UK' },
    address: '789 Pine Rd, Miami, FL 33101',
    dateOfBirth: '', // Missing DOB only
    shopRequests: [
      { itemId: 'SHOP009', itemName: 'Sunglasses - Ray-Ban', category: 'Fashion & Accessories', quantity: 1, price: 159.99, currency: 'USD' },
      { itemId: 'SHOP002', itemName: 'Perfume - Dior Sauvage', category: 'Perfumes & Cosmetics', quantity: 1, price: 79.99, currency: 'USD' }
    ]
  },
  { 
    id: 'P005', 
    name: 'David Wilson', 
    seat: '3A', 
    flightId: 'FL001',
    checkedIn: false,
    wheelchair: true,
    infant: false,
    ancillaryServices: ['Wheelchair Assistance'],
    specialMeal: 'Diabetic',
    bookingReference: 'ABC127',
    passport: { number: '', expiryDate: '', country: '' }, // Missing passport & address
    address: '',
    dateOfBirth: '1975-11-22',
    shopRequests: []
  },
  { 
    id: 'P006', 
    name: 'Jennifer Martinez', 
    seat: '3B', 
    flightId: 'FL001',
    checkedIn: false,
    wheelchair: false,
    infant: true,
    ancillaryServices: ['Infant Care Kit', 'Priority Boarding'],
    specialMeal: 'Regular',
    bookingReference: 'ABC128',
    passport: { number: '', expiryDate: '', country: '' }, // Missing passport & DOB
    address: '222 Elm St, Boston, MA 02101',
    dateOfBirth: '',
    shopRequests: []
  },
  { 
    id: 'P007', 
    name: 'Robert Taylor', 
    seat: '4A', 
    flightId: 'FL001',
    checkedIn: true,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Wi-Fi Access', 'Extra Baggage'],
    specialMeal: 'Kosher',
    bookingReference: 'ABC129',
    passport: { number: 'AU555666777', expiryDate: '2026-08-15', country: 'Australia' },
    address: '', // Missing address & DOB
    dateOfBirth: '',
    shopRequests: [
      { itemId: 'SHOP015', itemName: 'Wine - French Bordeaux', category: 'Food & Beverages', quantity: 1, price: 89.99, currency: 'USD' }
    ]
  },
  { 
    id: 'P008', 
    name: 'Lisa Anderson', 
    seat: '4B', 
    flightId: 'FL001',
    checkedIn: false,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Priority Boarding'],
    specialMeal: 'Halal',
    bookingReference: 'ABC130',
    passport: { number: '', expiryDate: '', country: '' }, // Missing all three
    address: '',
    dateOfBirth: '',
    shopRequests: []
  },

  // Flight FL002 passengers - More diverse scenarios
  { 
    id: 'P009', 
    name: 'James Thomas', 
    seat: '1A', 
    flightId: 'FL002',
    checkedIn: false,
    wheelchair: false,
    infant: true,
    ancillaryServices: ['Infant Care Kit', 'Extra Baggage'],
    specialMeal: 'Regular',
    bookingReference: 'DEF201',
    passport: { number: 'FR888999000', expiryDate: '2029-03-10', country: 'France' },
    address: '100 Seine St, Paris, France',
    dateOfBirth: '1992-05-18',
    shopRequests: [
      { itemId: 'SHOP021', itemName: 'Teddy Bear - Premium', category: 'Toys & Gifts', quantity: 1, price: 34.99, currency: 'USD' },
      { itemId: 'SHOP018', itemName: 'Eye Mask & Ear Plugs', category: 'Travel Essentials', quantity: 2, price: 14.99, currency: 'USD' }
    ]
  },
  { 
    id: 'P010', 
    name: 'Maria Garcia', 
    seat: '1B', 
    flightId: 'FL002',
    checkedIn: true,
    wheelchair: true,
    infant: false,
    ancillaryServices: ['Wheelchair Assistance', 'Priority Boarding'],
    specialMeal: 'Vegetarian',
    bookingReference: 'DEF202',
    passport: { number: 'ES111222333', expiryDate: '2027-06-25', country: 'Spain' },
    address: '', // Missing address only
    dateOfBirth: '1980-12-03',
    shopRequests: [
      { itemId: 'SHOP010', itemName: 'Silk Scarf - Hermès', category: 'Fashion & Accessories', quantity: 1, price: 395.00, currency: 'USD' }
    ]
  },
  { 
    id: 'P011', 
    name: 'Christopher Lee', 
    seat: '2A', 
    flightId: 'FL002',
    checkedIn: false,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Wi-Fi Access', 'Extra Legroom'],
    specialMeal: 'Regular',
    bookingReference: 'DEF203',
    passport: { number: '', expiryDate: '', country: '' }, // Missing passport only
    address: '567 Market St, San Francisco, CA 94102',
    dateOfBirth: '1987-09-14',
    shopRequests: []
  },
  { 
    id: 'P012', 
    name: 'Patricia White', 
    seat: '2B', 
    flightId: 'FL002',
    checkedIn: false,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Extra Baggage'],
    specialMeal: 'Gluten-Free',
    bookingReference: 'DEF204',
    passport: { number: 'IT444555666', expiryDate: '2028-10-20', country: 'Italy' },
    address: '789 Venice Blvd, Rome, Italy',
    dateOfBirth: '', // Missing DOB only
    shopRequests: [
      { itemId: 'SHOP014', itemName: 'Premium Coffee Set', category: 'Food & Beverages', quantity: 1, price: 34.99, currency: 'USD' },
      { itemId: 'SHOP003', itemName: 'Lipstick Set - MAC', category: 'Perfumes & Cosmetics', quantity: 1, price: 45.00, currency: 'USD' }
    ]
  },
  { 
    id: 'P013', 
    name: 'Daniel Harris', 
    seat: '3A', 
    flightId: 'FL002',
    checkedIn: true,
    wheelchair: false,
    infant: true,
    ancillaryServices: ['Infant Care Kit', 'Priority Boarding'],
    specialMeal: 'Regular',
    bookingReference: 'DEF205',
    passport: { number: '', expiryDate: '', country: '' }, // Missing passport & address
    address: '',
    dateOfBirth: '1995-02-28',
    shopRequests: []
  },
  { 
    id: 'P014', 
    name: 'Nancy Clark', 
    seat: '3B', 
    flightId: 'FL002',
    checkedIn: false,
    wheelchair: true,
    infant: false,
    ancillaryServices: ['Wheelchair Assistance'],
    specialMeal: 'Vegan',
    bookingReference: 'DEF206',
    passport: { number: 'DE777888999', expiryDate: '2030-01-15', country: 'Germany' },
    address: '321 Berlin St, Munich, Germany',
    dateOfBirth: '1983-07-09',
    shopRequests: [
      { itemId: 'SHOP006', itemName: 'Portable Charger - Anker', category: 'Electronics', quantity: 2, price: 39.99, currency: 'USD' }
    ]
  },

  // Flight FL003 passengers - Complete information mix
  { 
    id: 'P015', 
    name: 'Matthew Lewis', 
    seat: '1A', 
    flightId: 'FL003',
    checkedIn: false,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Priority Boarding', 'Wi-Fi Access'],
    specialMeal: 'Regular',
    bookingReference: 'GHI301',
    passport: { number: 'JP123789456', expiryDate: '2026-12-31', country: 'Japan' },
    address: '456 Tokyo Ave, Shibuya, Japan',
    dateOfBirth: '1991-04-15',
    shopRequests: [
      { itemId: 'SHOP007', itemName: 'Smart Watch - Samsung', category: 'Electronics', quantity: 1, price: 299.99, currency: 'USD' },
      { itemId: 'SHOP011', itemName: 'Leather Wallet', category: 'Fashion & Accessories', quantity: 1, price: 89.99, currency: 'USD' }
    ]
  },
  { 
    id: 'P016', 
    name: 'Karen Walker', 
    seat: '1B', 
    flightId: 'FL003',
    checkedIn: false,
    wheelchair: false,
    infant: true,
    ancillaryServices: ['Infant Care Kit', 'Extra Baggage'],
    specialMeal: 'Regular',
    bookingReference: 'GHI302',
    passport: { number: '', expiryDate: '', country: '' }, // Missing passport & DOB
    address: '890 Broadway, New York, NY 10003',
    dateOfBirth: '',
    shopRequests: []
  },
  { 
    id: 'P017', 
    name: 'Steven Hall', 
    seat: '2A', 
    flightId: 'FL003',
    checkedIn: true,
    wheelchair: true,
    infant: false,
    ancillaryServices: ['Wheelchair Assistance', 'Priority Boarding'],
    specialMeal: 'Diabetic',
    bookingReference: 'GHI303',
    passport: { number: 'NZ987654123', expiryDate: '2029-07-20', country: 'New Zealand' },
    address: '', // Missing address & DOB
    dateOfBirth: '',
    shopRequests: []
  },
  { 
    id: 'P018', 
    name: 'Betty Allen', 
    seat: '2B', 
    flightId: 'FL003',
    checkedIn: false,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Extra Legroom'],
    specialMeal: 'Vegetarian',
    bookingReference: 'GHI304',
    passport: { number: '', expiryDate: '', country: '' }, // Missing all three
    address: '',
    dateOfBirth: '',
    shopRequests: []
  },
  { 
    id: 'P019', 
    name: 'Paul Young', 
    seat: '3A', 
    flightId: 'FL003',
    checkedIn: false,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Wi-Fi Access', 'Extra Baggage'],
    specialMeal: 'Kosher',
    bookingReference: 'GHI305',
    passport: { number: 'SE456123789', expiryDate: '2027-09-10', country: 'Sweden' },
    address: '234 Stockholm St, Sweden',
    dateOfBirth: '', // Missing DOB only
    shopRequests: [
      { itemId: 'SHOP022', itemName: 'Puzzle Game Set', category: 'Toys & Gifts', quantity: 1, price: 24.99, currency: 'USD' },
      { itemId: 'SHOP016', itemName: 'Gourmet Snack Box', category: 'Food & Beverages', quantity: 3, price: 24.99, currency: 'USD' }
    ]
  },
  { 
    id: 'P020', 
    name: 'Sandra King', 
    seat: '3B', 
    flightId: 'FL003',
    checkedIn: true,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Priority Boarding'],
    specialMeal: 'Halal',
    bookingReference: 'GHI306',
    passport: { number: 'BR789456123', expiryDate: '2028-11-05', country: 'Brazil' },
    address: '567 Rio Blvd, Rio de Janeiro, Brazil',
    dateOfBirth: '1989-08-22',
    shopRequests: [
      { itemId: 'SHOP004', itemName: 'Face Cream - La Mer', category: 'Perfumes & Cosmetics', quantity: 1, price: 120.00, currency: 'USD' },
      { itemId: 'SHOP020', itemName: 'Compression Socks', category: 'Travel Essentials', quantity: 2, price: 12.99, currency: 'USD' }
    ]
  },

  // Flight FL004 passengers - Boston to Denver
  { 
    id: 'P021', 
    name: 'Thomas Anderson', 
    seat: '1A', 
    flightId: 'FL004',
    checkedIn: true,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Priority Boarding', 'Extra Legroom'],
    specialMeal: 'Regular',
    bookingReference: 'JKL401',
    passport: { number: 'US789012345', expiryDate: '2027-03-15', country: 'USA' },
    address: '890 Beacon St, Boston, MA 02215',
    dateOfBirth: '1982-06-10',
    shopRequests: [
      { itemId: 'SHOP008', itemName: 'Travel Adapter', category: 'Electronics', quantity: 1, price: 24.99, currency: 'USD' }
    ]
  },
  { 
    id: 'P022', 
    name: 'Rebecca Chen', 
    seat: '1B', 
    flightId: 'FL004',
    checkedIn: false,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Wi-Fi Access'],
    specialMeal: 'Vegetarian',
    bookingReference: 'JKL402',
    passport: { number: '', expiryDate: '', country: '' }, // Missing passport
    address: '234 Commonwealth Ave, Boston, MA 02116',
    dateOfBirth: '1994-11-28',
    shopRequests: []
  },
  { 
    id: 'P023', 
    name: 'Marcus Johnson', 
    seat: '2A', 
    flightId: 'FL004',
    checkedIn: true,
    wheelchair: true,
    infant: false,
    ancillaryServices: ['Wheelchair Assistance', 'Priority Boarding'],
    specialMeal: 'Diabetic',
    bookingReference: 'JKL403',
    passport: { number: 'US345678901', expiryDate: '2029-08-20', country: 'USA' },
    address: '',
    dateOfBirth: '1978-02-14',
    shopRequests: []
  },
  { 
    id: 'P024', 
    name: 'Linda Martinez', 
    seat: '2B', 
    flightId: 'FL004',
    checkedIn: false,
    wheelchair: false,
    infant: true,
    ancillaryServices: ['Infant Care Kit', 'Extra Baggage'],
    specialMeal: 'Regular',
    bookingReference: 'JKL404',
    passport: { number: 'MX567890123', expiryDate: '2026-12-10', country: 'Mexico' },
    address: '567 Tremont St, Boston, MA 02118',
    dateOfBirth: '',
    shopRequests: [
      { itemId: 'SHOP021', itemName: 'Teddy Bear - Premium', category: 'Toys & Gifts', quantity: 1, price: 34.99, currency: 'USD' }
    ]
  },

  // Flight FL005 passengers - Dallas to Atlanta
  { 
    id: 'P025', 
    name: 'Robert Williams', 
    seat: '1A', 
    flightId: 'FL005',
    checkedIn: true,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Priority Boarding', 'Lounge Access'],
    specialMeal: 'Kosher',
    bookingReference: 'MNO501',
    passport: { number: 'US456789012', expiryDate: '2028-05-25', country: 'USA' },
    address: '123 Oak Lawn Ave, Dallas, TX 75219',
    dateOfBirth: '1986-09-05',
    shopRequests: [
      { itemId: 'SHOP012', itemName: 'Travel Bag - Samsonite', category: 'Fashion & Accessories', quantity: 1, price: 149.99, currency: 'USD' }
    ]
  },
  { 
    id: 'P026', 
    name: 'Angela Davis', 
    seat: '1B', 
    flightId: 'FL005',
    checkedIn: true,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Extra Baggage', 'Fast Track Security'],
    specialMeal: 'Vegan',
    bookingReference: 'MNO502',
    passport: { number: '', expiryDate: '', country: '' },
    address: '',
    dateOfBirth: '',
    shopRequests: []
  },
  { 
    id: 'P027', 
    name: 'Kevin Thompson', 
    seat: '2A', 
    flightId: 'FL005',
    checkedIn: false,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Wi-Fi Access', 'Extra Legroom'],
    specialMeal: 'Gluten-Free',
    bookingReference: 'MNO503',
    passport: { number: 'CA234567890', expiryDate: '2027-11-18', country: 'Canada' },
    address: '456 Peachtree St, Atlanta, GA 30303',
    dateOfBirth: '1990-04-22',
    shopRequests: [
      { itemId: 'SHOP005', itemName: 'Wireless Headphones - Sony', category: 'Electronics', quantity: 1, price: 199.99, currency: 'USD' }
    ]
  },

  // Flight FL006 passengers - Las Vegas to Phoenix (Departed)
  { 
    id: 'P028', 
    name: 'Michelle Rodriguez', 
    seat: '1A', 
    flightId: 'FL006',
    checkedIn: true,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Priority Boarding'],
    specialMeal: 'Regular',
    bookingReference: 'PQR601',
    passport: { number: 'US678901234', expiryDate: '2029-01-30', country: 'USA' },
    address: '789 Las Vegas Blvd, Las Vegas, NV 89109',
    dateOfBirth: '1993-07-16',
    shopRequests: []
  },
  { 
    id: 'P029', 
    name: 'Brian Lee', 
    seat: '1B', 
    flightId: 'FL006',
    checkedIn: true,
    wheelchair: false,
    infant: false,
    ancillaryServices: ['Extra Baggage'],
    specialMeal: 'Regular',
    bookingReference: 'PQR602',
    passport: { number: 'KR890123456', expiryDate: '2026-09-12', country: 'South Korea' },
    address: '',
    dateOfBirth: '1988-12-03',
    shopRequests: [
      { itemId: 'SHOP023', itemName: 'Playing Cards - Luxury', category: 'Toys & Gifts', quantity: 2, price: 15.99, currency: 'USD' }
    ]
  },
];

export const ancillaryServices: string[] = [
  'Priority Boarding',
  'Extra Baggage',
  'Wheelchair Assistance',
  'Infant Care Kit',
  'Wi-Fi Access',
  'Extra Legroom',
  'Lounge Access',
  'Fast Track Security',
  'Pet Care',
  'Sports Equipment'
];

export const mealOptions: string[] = [
  'Regular',
  'Vegetarian',
  'Vegan',
  'Gluten-Free',
  'Diabetic',
  'Kosher',
  'Halal',
  'Low Sodium',
  'Child Meal',
  'Fruit Platter'
];

export const seatLayout = {
  rows: 10,
  seatsPerRow: ['A', 'B', 'C', 'D', 'E', 'F'],
  aisleAfter: ['C'], // Aisle after seat C
};

export const shopItems: ShopItem[] = [
  // Perfumes & Cosmetics
  { id: 'SHOP001', name: 'Perfume - Chanel No. 5', category: 'Perfumes & Cosmetics', price: 89.99, currency: 'USD' },
  { id: 'SHOP002', name: 'Perfume - Dior Sauvage', category: 'Perfumes & Cosmetics', price: 79.99, currency: 'USD' },
  { id: 'SHOP003', name: 'Lipstick Set - MAC', category: 'Perfumes & Cosmetics', price: 45.00, currency: 'USD' },
  { id: 'SHOP004', name: 'Face Cream - La Mer', category: 'Perfumes & Cosmetics', price: 120.00, currency: 'USD' },
  
  // Electronics
  { id: 'SHOP005', name: 'Wireless Headphones - Sony', category: 'Electronics', price: 199.99, currency: 'USD' },
  { id: 'SHOP006', name: 'Portable Charger - Anker', category: 'Electronics', price: 39.99, currency: 'USD' },
  { id: 'SHOP007', name: 'Smart Watch - Samsung', category: 'Electronics', price: 299.99, currency: 'USD' },
  { id: 'SHOP008', name: 'Travel Adapter', category: 'Electronics', price: 24.99, currency: 'USD' },
  
  // Fashion & Accessories
  { id: 'SHOP009', name: 'Sunglasses - Ray-Ban', category: 'Fashion & Accessories', price: 159.99, currency: 'USD' },
  { id: 'SHOP010', name: 'Silk Scarf - Hermès', category: 'Fashion & Accessories', price: 395.00, currency: 'USD' },
  { id: 'SHOP011', name: 'Leather Wallet', category: 'Fashion & Accessories', price: 89.99, currency: 'USD' },
  { id: 'SHOP012', name: 'Travel Bag - Samsonite', category: 'Fashion & Accessories', price: 149.99, currency: 'USD' },
  
  // Food & Beverages
  { id: 'SHOP013', name: 'Swiss Chocolate Box', category: 'Food & Beverages', price: 19.99, currency: 'USD' },
  { id: 'SHOP014', name: 'Premium Coffee Set', category: 'Food & Beverages', price: 34.99, currency: 'USD' },
  { id: 'SHOP015', name: 'Wine - French Bordeaux', category: 'Food & Beverages', price: 89.99, currency: 'USD' },
  { id: 'SHOP016', name: 'Gourmet Snack Box', category: 'Food & Beverages', price: 24.99, currency: 'USD' },
  
  // Travel Essentials
  { id: 'SHOP017', name: 'Travel Pillow Set', category: 'Travel Essentials', price: 29.99, currency: 'USD' },
  { id: 'SHOP018', name: 'Eye Mask & Ear Plugs', category: 'Travel Essentials', price: 14.99, currency: 'USD' },
  { id: 'SHOP019', name: 'Travel Size Toiletries', category: 'Travel Essentials', price: 19.99, currency: 'USD' },
  { id: 'SHOP020', name: 'Compression Socks', category: 'Travel Essentials', price: 12.99, currency: 'USD' },
  
  // Toys & Gifts
  { id: 'SHOP021', name: 'Teddy Bear - Premium', category: 'Toys & Gifts', price: 34.99, currency: 'USD' },
  { id: 'SHOP022', name: 'Puzzle Game Set', category: 'Toys & Gifts', price: 24.99, currency: 'USD' },
  { id: 'SHOP023', name: 'Playing Cards - Luxury', category: 'Toys & Gifts', price: 15.99, currency: 'USD' },
  { id: 'SHOP024', name: 'Souvenir Keychain Set', category: 'Toys & Gifts', price: 9.99, currency: 'USD' },
];

export const shopCategories: string[] = [
  'All',
  'Perfumes & Cosmetics',
  'Electronics',
  'Fashion & Accessories',
  'Food & Beverages',
  'Travel Essentials',
  'Toys & Gifts'
];
