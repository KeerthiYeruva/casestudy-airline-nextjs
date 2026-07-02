import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlightStatusDashboard from '../components/customer/FlightStatusDashboard';
import type { Flight } from '../types/flight';

const mockFetchFlights = jest.fn();

const mockFlights: Flight[] = [
  {
    id: 'FL001',
    flightNumber: 'AA101',
    origin: 'New York (JFK)',
    destination: 'Los Angeles (LAX)',
    departureTime: '10:00 AM',
    arrivalTime: '01:30 PM',
    date: '2026-07-03',
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
    date: '2026-07-03',
    status: 'Delayed',
    aircraft: 'Airbus A320',
    gate: 'B5',
    terminal: '2',
    totalSeats: 150,
    availableSeats: 144,
  },
  {
    id: 'FL003',
    flightNumber: 'CC303',
    origin: 'Seattle (SEA)',
    destination: 'Tokyo (HND)',
    departureTime: '06:15 PM',
    arrivalTime: '09:20 PM',
    date: '2026-07-04',
    status: 'Boarding',
    aircraft: 'Boeing 787',
    gate: 'C8',
    terminal: '1',
    totalSeats: 220,
    availableSeats: 18,
  },
];

jest.mock('../stores/useDataStore', () => ({
  __esModule: true,
  default: () => ({
    flights: mockFlights,
    fetchFlights: mockFetchFlights,
  }),
}));

describe('FlightStatusDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders public flight status cards with gates and terminals', () => {
    render(<FlightStatusDashboard />);

    expect(screen.getByRole('heading', { name: /flight status/i })).toBeInTheDocument();
    expect(screen.getByText('AA101')).toBeInTheDocument();
    expect(screen.getByText('BB202')).toBeInTheDocument();
    expect(screen.getByText('CC303')).toBeInTheDocument();
    expect(screen.getByText('Gate A12')).toBeInTheDocument();
    expect(screen.getByText('Terminal 4')).toBeInTheDocument();
    expect(screen.getByText('3 flights')).toBeInTheDocument();
  });

  it('filters flights by route search and status', () => {
    render(<FlightStatusDashboard />);

    fireEvent.change(screen.getByRole('textbox', { name: /search flights/i }), { target: { value: 'Chicago' } });

    expect(screen.getByText('BB202')).toBeInTheDocument();
    expect(screen.queryByText('AA101')).not.toBeInTheDocument();

    fireEvent.mouseDown(screen.getByRole('combobox', { name: /status/i }));
    fireEvent.click(within(screen.getByRole('listbox')).getByText('Boarding'));

    expect(screen.getByText(/no flights match/i)).toBeInTheDocument();
  });
});