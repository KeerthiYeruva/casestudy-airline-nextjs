import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import PassengerPortal from '../components/customer/PassengerPortal';
import type { Flight } from '../types/flight';
import type { Passenger } from '../types/passenger';

const mockFetchFlights = jest.fn();
const mockFetchPassengers = jest.fn();
const mockCheckInPassenger = jest.fn();
const mockChangeSeat = jest.fn();

const mockFlights: Flight[] = [
  {
    id: 'FL100',
    flightNumber: 'AA100',
    origin: 'New York (JFK)',
    destination: 'Los Angeles (LAX)',
    departureTime: '10:00 AM',
    arrivalTime: '01:30 PM',
    date: '2026-07-08',
    status: 'On Time',
    aircraft: 'Boeing 737',
    gate: 'A12',
    terminal: '4',
    totalSeats: 180,
    availableSeats: 171,
  },
  {
    id: 'FL090',
    flightNumber: 'AA090',
    origin: 'Miami (MIA)',
    destination: 'Chicago (ORD)',
    departureTime: '09:00 AM',
    arrivalTime: '11:45 AM',
    date: '2026-06-10',
    status: 'Arrived',
    aircraft: 'Airbus A320',
    gate: 'B4',
    terminal: '2',
    totalSeats: 150,
    availableSeats: 140,
  },
];

const mockPassengers: Passenger[] = [
  {
    id: 'P100',
    name: 'Maya Patel',
    seat: '12A',
    flightId: 'FL100',
    ancillaryServices: ['Priority Boarding'],
    specialMeal: 'Vegetarian',
    wheelchair: false,
    infant: false,
    checkedIn: false,
    bookingReference: 'MAY100',
    shopRequests: [],
    premiumUpgrade: true,
  },
  {
    id: 'P090',
    name: 'Maya Patel',
    seat: '8C',
    flightId: 'FL090',
    ancillaryServices: [],
    specialMeal: 'Regular',
    wheelchair: false,
    infant: false,
    checkedIn: true,
    bookingReference: 'MAY100',
    shopRequests: [],
  },
];

jest.mock('../stores/useDataStore', () => ({
  __esModule: true,
  default: () => ({
    flights: mockFlights,
    passengers: mockPassengers,
    fetchFlights: mockFetchFlights,
    fetchPassengers: mockFetchPassengers,
    checkInPassenger: mockCheckInPassenger,
    changeSeat: mockChangeSeat,
  }),
}));

describe('PassengerPortal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckInPassenger.mockResolvedValue({
      ...mockPassengers[0],
      checkedIn: true,
    });
    mockChangeSeat.mockResolvedValue({
      ...mockPassengers[0],
      seat: '14C',
    });
  });

  it('finds trips by PNR and last name', () => {
    render(<PassengerPortal />);

    fireEvent.change(screen.getByRole('textbox', { name: /pnr/i }), { target: { value: 'MAY100' } });
    fireEvent.change(screen.getByRole('textbox', { name: /last name/i }), { target: { value: 'Patel' } });
    fireEvent.click(screen.getByRole('button', { name: /find trip/i }));

    expect(screen.getByRole('heading', { name: /upcoming flights/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /past flights/i })).toBeInTheDocument();
    expect(screen.getByText('AA100')).toBeInTheDocument();
    expect(screen.getByText('AA090')).toBeInTheDocument();
    expect(screen.getAllByText('Seat')).toHaveLength(2);
    expect(screen.getByText('12A')).toBeInTheDocument();
    expect(screen.getAllByText('PNR MAY100')).toHaveLength(2);
    expect(screen.getByText('Priority Boarding')).toBeInTheDocument();
  });

  it('checks in online and opens the boarding pass', async () => {
    render(<PassengerPortal />);

    fireEvent.change(screen.getByRole('textbox', { name: /pnr/i }), { target: { value: 'MAY100' } });
    fireEvent.change(screen.getByRole('textbox', { name: /last name/i }), { target: { value: 'Patel' } });
    fireEvent.click(screen.getByRole('button', { name: /find trip/i }));
    fireEvent.click(screen.getByRole('button', { name: /check in online/i }));

    await waitFor(() => {
      expect(mockCheckInPassenger).toHaveBeenCalledWith('P100');
    });

    const boardingPass = await screen.findByRole('dialog', { name: /boarding pass/i });
    expect(boardingPass).toBeInTheDocument();
    expect(within(boardingPass).getByText('AA100')).toBeInTheDocument();
    expect(within(boardingPass).getByText('12A')).toBeInTheDocument();
  });

  it('changes a seat before online check-in', async () => {
    render(<PassengerPortal />);

    fireEvent.change(screen.getByRole('textbox', { name: /pnr/i }), { target: { value: 'MAY100' } });
    fireEvent.change(screen.getByRole('textbox', { name: /last name/i }), { target: { value: 'Patel' } });
    fireEvent.click(screen.getByRole('button', { name: /find trip/i }));
    fireEvent.click(screen.getAllByRole('button', { name: /change seat/i })[0]);

    const dialog = screen.getByRole('dialog', { name: /change seat/i });
    fireEvent.change(within(dialog).getByRole('textbox', { name: /new seat number/i }), { target: { value: '14C' } });
    fireEvent.click(within(dialog).getByRole('button', { name: /change seat/i }));

    await waitFor(() => {
      expect(mockChangeSeat).toHaveBeenCalledWith('P100', '14C');
    });
  });

  it('shows an empty state when the booking cannot be found', () => {
    render(<PassengerPortal />);

    fireEvent.change(screen.getByRole('textbox', { name: /pnr/i }), { target: { value: 'UNKNOWN' } });
    fireEvent.change(screen.getByRole('textbox', { name: /last name/i }), { target: { value: 'Patel' } });
    fireEvent.click(screen.getByRole('button', { name: /find trip/i }));

    expect(screen.getByText(/no booking matched/i)).toBeInTheDocument();
  });
});