import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlightOpsTab from '../components/admin/tabs/FlightOpsTab';
import type { Flight } from '../types/flight';

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
];

describe('FlightOpsTab', () => {
  const defaultProps = {
    flights: mockFlights,
    onAddFlight: jest.fn(),
    onUpdateFlight: jest.fn(),
    onDeleteFlight: jest.fn(),
  };

  it('renders operational flight fields', () => {
    render(<FlightOpsTab {...defaultProps} />);

    expect(screen.getByText('Flight Status & Gates')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /create flight/i })).toBeInTheDocument();
    expect(screen.getByText('AA101')).toBeInTheDocument();
    expect(screen.getByText('Gate A12')).toBeInTheDocument();
    expect(screen.getByText('Terminal 4')).toBeInTheDocument();
    expect(screen.getByLabelText('Gate')).toHaveValue('A12');
    expect(screen.getByLabelText('Terminal')).toHaveValue('4');
  });

  it('submits edited gate and terminal details', async () => {
    const onUpdateFlight = jest.fn().mockResolvedValue(true);

    render(<FlightOpsTab {...defaultProps} onUpdateFlight={onUpdateFlight} />);

    fireEvent.change(screen.getByLabelText('Gate'), { target: { value: 'B8' } });
    fireEvent.change(screen.getByLabelText('Terminal'), { target: { value: '2' } });
    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(onUpdateFlight).toHaveBeenCalledWith('FL001', {
        status: 'On Time',
        gate: 'B8',
        terminal: '2',
      });
    });
  });
});