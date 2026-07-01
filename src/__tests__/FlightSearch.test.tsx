import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlightSearch from '@/components/customer/FlightSearch';
import type { Flight } from '@/types/flight';

const mockFetchFlights = jest.fn();

const mockFlights: Flight[] = [
  {
    id: 'FL001',
    flightNumber: 'AA101',
    origin: 'New York (JFK)',
    destination: 'Los Angeles (LAX)',
    departureTime: '10:00 AM',
    arrivalTime: '01:30 PM',
    date: '2025-12-03',
    status: 'On Time',
    aircraft: 'Boeing 737',
    gate: 'A12',
    terminal: '4',
    totalSeats: 180,
    availableSeats: 172,
  },
  {
    id: 'FL002',
    flightNumber: 'BB202',
    origin: 'Chicago (ORD)',
    destination: 'Miami (MIA)',
    departureTime: '12:30 PM',
    arrivalTime: '04:45 PM',
    date: '2025-12-03',
    status: 'Boarding',
    aircraft: 'Airbus A320',
    gate: 'B5',
    terminal: '2',
    totalSeats: 150,
    availableSeats: 144,
  },
  {
    id: 'FL003',
    flightNumber: 'CC303',
    origin: 'New York (JFK)',
    destination: 'Los Angeles (LAX)',
    departureTime: '03:15 PM',
    arrivalTime: '06:45 PM',
    date: '2025-12-03',
    status: 'Cancelled',
    aircraft: 'Boeing 787',
    gate: 'C8',
    terminal: '1',
    totalSeats: 200,
    availableSeats: 194,
  },
];

jest.mock('@/stores/useDataStore', () => ({
  __esModule: true,
  default: () => ({
    flights: mockFlights,
    fetchFlights: mockFetchFlights,
  }),
}));

describe('FlightSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search controls and featured flights', () => {
    render(<FlightSearch />);

    expect(screen.getByRole('heading', { name: /flight search/i })).toBeInTheDocument();
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
    expect(screen.getByText('AA101')).toBeInTheDocument();
    expect(screen.getByText('BB202')).toBeInTheDocument();
  });

  it('filters bookable flights by route and date', () => {
    render(<FlightSearch />);

    fireEvent.change(screen.getByLabelText('From'), { target: { value: 'New York' } });
    fireEvent.change(screen.getByLabelText('To'), { target: { value: 'Los Angeles' } });
    fireEvent.change(screen.getByLabelText('Departure Date'), { target: { value: '2025-12-03' } });
    fireEvent.click(screen.getByRole('button', { name: /search flights/i }));

    expect(screen.getByText('1 matching flights')).toBeInTheDocument();
    expect(screen.getByText('AA101')).toBeInTheDocument();
    expect(screen.queryByText('BB202')).not.toBeInTheDocument();
    expect(screen.queryByText('CC303')).not.toBeInTheDocument();
  });
});