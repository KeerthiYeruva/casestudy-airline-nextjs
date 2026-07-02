import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminMetrics from '../features/admin/components/AdminMetrics';
import type { Flight } from '../domain/flights/types';
import type { Passenger } from '../domain/passengers/types';

const flights: Flight[] = [
  {
    id: 'FL-TODAY',
    flightNumber: 'AA101',
    origin: 'New York (JFK)',
    destination: 'Los Angeles (LAX)',
    departureTime: '10:00 AM',
    arrivalTime: '01:30 PM',
    date: '2026-07-01',
    status: 'On Time',
    aircraft: 'Boeing 737',
    gate: 'A12',
    terminal: '4',
    totalSeats: 180,
    availableSeats: 170,
  },
  {
    id: 'FL-LATER',
    flightNumber: 'BB202',
    origin: 'Chicago (ORD)',
    destination: 'Miami (MIA)',
    departureTime: '12:30 PM',
    arrivalTime: '04:45 PM',
    date: '2026-07-02',
    status: 'Delayed',
    aircraft: 'Airbus A320',
    gate: 'B5',
    terminal: '2',
    totalSeats: 150,
    availableSeats: 144,
  },
];

const passengers: Passenger[] = [
  {
    id: 'P1',
    name: 'Maya Patel',
    seat: '1A',
    flightId: 'FL-TODAY',
    ancillaryServices: ['Priority Boarding', 'Lounge Access'],
    specialMeal: 'Regular',
    wheelchair: false,
    infant: false,
    checkedIn: true,
    bookingReference: 'MAY101',
    shopRequests: [{ itemId: 'SHOP1', itemName: 'Perfume', category: 'Perfumes', price: 50, quantity: 2, currency: 'USD' }],
    premiumUpgrade: true,
  },
  {
    id: 'P2',
    name: 'Noah Kim',
    seat: '14C',
    flightId: 'FL-TODAY',
    ancillaryServices: ['Priority Boarding'],
    specialMeal: 'Vegetarian',
    wheelchair: false,
    infant: false,
    checkedIn: false,
    bookingReference: 'NOA101',
    shopRequests: [],
  },
  {
    id: 'P3',
    name: 'Ava Smith',
    seat: '8D',
    flightId: 'FL-LATER',
    ancillaryServices: ['Extra Baggage'],
    specialMeal: 'Regular',
    wheelchair: false,
    infant: false,
    checkedIn: true,
    bookingReference: 'AVA202',
    shopRequests: [],
    premiumUpgrade: true,
  },
];

describe('AdminMetrics', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date('2026-07-01T12:00:00Z'));
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('shows airline analytics for today, check-in, revenue, and top ancillary service', () => {
    render(<AdminMetrics flights={flights} passengers={passengers} />);

    expect(screen.getByText('Passengers Today')).toBeInTheDocument();
    expect(screen.getByText('Flights Today')).toBeInTheDocument();
    expect(screen.getByText('Check-In %')).toBeInTheDocument();
    expect(screen.getByText('Premium Seat Revenue')).toBeInTheDocument();
    expect(screen.getByText('Top Ancillary Service')).toBeInTheDocument();

    expect(screen.getByText('1 flights departing today')).toBeInTheDocument();
    expect(screen.getByText('2/3 completed')).toBeInTheDocument();
    expect(screen.getByText('$98')).toBeInTheDocument();
    expect(screen.getByText('Priority Boarding')).toBeInTheDocument();
    expect(screen.getByText('2 passengers selected')).toBeInTheDocument();
    expect(screen.getByText('$100')).toBeInTheDocument();
  });
});