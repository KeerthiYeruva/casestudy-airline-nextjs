import type { Meta, StoryObj } from '@storybook/nextjs';
import AdminMetrics from '@/components/admin/AdminMetrics';
import type { Flight } from '@/types/flight';
import type { Passenger } from '@/types/passenger';

const flights: Flight[] = [
  {
    id: 'AA101',
    name: 'American Airlines 101',
    flightNumber: 'AA101',
    origin: 'NYC',
    destination: 'LAX',
    departureTime: '08:00 AM',
    arrivalTime: '11:15 AM',
    date: '2026-07-01',
    status: 'Boarding',
    aircraft: 'Boeing 737',
    totalSeats: 180,
    availableSeats: 60,
  },
  {
    id: 'BA202',
    name: 'British Airways 202',
    flightNumber: 'BA202',
    origin: 'LHR',
    destination: 'JFK',
    departureTime: '01:30 PM',
    arrivalTime: '04:45 PM',
    date: '2026-07-01',
    status: 'On Time',
    aircraft: 'Airbus A350',
    totalSeats: 220,
    availableSeats: 95,
  },
];

const passengers: Passenger[] = [
  {
    id: 'P1',
    name: 'John Doe',
    seat: '4A',
    flightId: 'AA101',
    ancillaryServices: ['Wi-Fi'],
    specialMeal: 'Regular',
    wheelchair: false,
    infant: false,
    checkedIn: true,
    bookingReference: 'BKG123456',
    premiumUpgrade: true,
    shopRequests: [
      { itemId: 'S1', itemName: 'Headphones', category: 'Electronics', price: 29, quantity: 1, currency: 'USD' },
    ],
  },
  {
    id: 'P2',
    name: 'Jane Smith',
    seat: '8C',
    flightId: 'AA101',
    ancillaryServices: [],
    specialMeal: 'Vegetarian',
    wheelchair: false,
    infant: false,
    checkedIn: false,
    bookingReference: 'BKG987654',
    shopRequests: [],
  },
  {
    id: 'P3',
    name: 'Ava Patel',
    seat: '2F',
    flightId: 'BA202',
    ancillaryServices: ['Priority Boarding'],
    specialMeal: 'Regular',
    wheelchair: false,
    infant: false,
    checkedIn: true,
    bookingReference: 'BKG456789',
    premiumUpgrade: true,
    shopRequests: [
      { itemId: 'S2', itemName: 'Perfume', category: 'Perfumes & Cosmetics', price: 75, quantity: 2, currency: 'USD' },
    ],
  },
];

const meta = {
  title: 'Admin/AdminMetrics',
  component: AdminMetrics,
  args: {
    flights,
    passengers,
  },
} satisfies Meta<typeof AdminMetrics>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Overview: Story = {};

export const EmptyState: Story = {
  args: {
    flights: [],
    passengers: [],
  },
};