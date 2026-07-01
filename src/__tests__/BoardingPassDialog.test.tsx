import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import BoardingPassDialog from '@/components/checkin/BoardingPassDialog';
import type { Flight } from '@/types/flight';
import type { Passenger } from '@/types/passenger';

const mockFlight: Flight = {
  id: 'FL001',
  flightNumber: 'AA101',
  origin: 'New York (JFK)',
  destination: 'Los Angeles (LAX)',
  departureTime: '10:00 AM',
  arrivalTime: '01:30 PM',
  date: '2025-12-03',
  status: 'Boarding',
  aircraft: 'Boeing 737',
  gate: 'A12',
  terminal: '4',
  totalSeats: 180,
  availableSeats: 172,
};

const mockPassenger: Passenger = {
  id: 'P001',
  name: 'John Smith',
  seat: '1C',
  flightId: 'FL001',
  ancillaryServices: [],
  specialMeal: 'Vegetarian',
  wheelchair: false,
  infant: false,
  checkedIn: true,
  bookingReference: 'ABC123',
  shopRequests: [],
  premiumUpgrade: true,
};

describe('BoardingPassDialog', () => {
  it('renders boarding pass details from passenger and flight data', () => {
    render(
      <BoardingPassDialog
        open
        passenger={mockPassenger}
        flight={mockFlight}
        onClose={jest.fn()}
      />
    );

    expect(screen.getByRole('dialog', { name: /boarding pass/i })).toBeInTheDocument();
    expect(screen.getByText('John Smith')).toBeInTheDocument();
    expect(screen.getByText('AA101')).toBeInTheDocument();
    expect(screen.getByText('New York (JFK) to Los Angeles (LAX)')).toBeInTheDocument();
    expect(screen.getByText('A12')).toBeInTheDocument();
    expect(screen.getByText('1C')).toBeInTheDocument();
    expect(screen.getByText('9:15 AM')).toBeInTheDocument();
    expect(screen.getByLabelText('Boarding pass code ABC123')).toBeInTheDocument();
  });

  it('calls window print from the print action', () => {
    const printSpy = jest.spyOn(window, 'print').mockImplementation(() => {});

    render(
      <BoardingPassDialog
        open
        passenger={mockPassenger}
        flight={mockFlight}
        onClose={jest.fn()}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: /print/i }));

    expect(printSpy).toHaveBeenCalledTimes(1);
    printSpy.mockRestore();
  });
});