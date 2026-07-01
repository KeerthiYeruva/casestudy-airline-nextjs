import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import AircraftManagementTab from '@/components/admin/tabs/AircraftManagementTab';
import type { Flight } from '@/types/flight';

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
    aircraftStatus: 'Active',
    seatLayout: 'Single aisle',
    gate: 'A12',
    terminal: '4',
    totalSeats: 180,
    availableSeats: 172,
  },
];

describe('AircraftManagementTab', () => {
  it('renders existing aircraft details', () => {
    render(<AircraftManagementTab flights={mockFlights} onUpdateFlight={jest.fn()} />);

    expect(screen.getByText('Aircraft Management')).toBeInTheDocument();
    expect(screen.getByText('AA101')).toBeInTheDocument();
    expect(screen.getByLabelText('Aircraft')).toHaveValue('Boeing 737');
    expect(screen.getByLabelText('Capacity')).toHaveValue(180);
    expect(screen.getByLabelText('Available Seats')).toHaveValue(172);
    expect(screen.getByLabelText('Seat Layout')).toHaveValue('Single aisle');
    expect(screen.getByRole('combobox', { name: /aircraft status/i })).toHaveTextContent('Active');
  });

  it('saves aircraft model, capacity, seat layout, and status', async () => {
    const onUpdateFlight = jest.fn().mockResolvedValue(true);

    render(<AircraftManagementTab flights={mockFlights} onUpdateFlight={onUpdateFlight} />);

    fireEvent.change(screen.getByLabelText('Aircraft'), { target: { value: 'Airbus A320' } });
    fireEvent.change(screen.getByLabelText('Capacity'), { target: { value: '150' } });
    fireEvent.change(screen.getByLabelText('Available Seats'), { target: { value: '141' } });
    fireEvent.change(screen.getByLabelText('Seat Layout'), { target: { value: '3-3 narrow-body' } });
    fireEvent.mouseDown(screen.getByRole('combobox', { name: /aircraft status/i }));
    fireEvent.click(within(screen.getByRole('listbox')).getByText('Maintenance'));
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(onUpdateFlight).toHaveBeenCalledWith('FL001', {
        aircraft: 'Airbus A320',
        totalSeats: 150,
        availableSeats: 141,
        seatLayout: '3-3 narrow-body',
        aircraftStatus: 'Maintenance',
      });
    });
  });
});