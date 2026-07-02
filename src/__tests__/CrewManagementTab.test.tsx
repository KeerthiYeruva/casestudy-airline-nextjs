import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import CrewManagementTab from '../features/admin/components/tabs/CrewManagementTab';
import type { Flight } from '../domain/flights/types';

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
    crew: {
      pilot: 'Captain Rivera',
      coPilot: 'First Officer Chen',
      cabinCrew: ['Avery Stone', 'Mina Park'],
    },
  },
];

describe('CrewManagementTab', () => {
  it('renders existing crew assignments', () => {
    render(<CrewManagementTab flights={mockFlights} onUpdateFlight={jest.fn()} />);

    expect(screen.getByText('Crew Management')).toBeInTheDocument();
    expect(screen.getByText('AA101')).toBeInTheDocument();
    expect(screen.getByLabelText('Pilot')).toHaveValue('Captain Rivera');
    expect(screen.getByLabelText('Co-Pilot')).toHaveValue('First Officer Chen');
    expect(screen.getByLabelText('Cabin Crew')).toHaveValue('Avery Stone\nMina Park');
  });

  it('saves pilot, co-pilot, and cabin crew assignments', async () => {
    const onUpdateFlight = jest.fn().mockResolvedValue(true);

    render(<CrewManagementTab flights={mockFlights} onUpdateFlight={onUpdateFlight} />);

    fireEvent.change(screen.getByLabelText('Pilot'), { target: { value: 'Captain Morgan' } });
    fireEvent.change(screen.getByLabelText('Co-Pilot'), { target: { value: 'First Officer Lee' } });
    fireEvent.change(screen.getByLabelText('Cabin Crew'), { target: { value: 'Sam Ortiz, Priya Shah' } });
    fireEvent.click(screen.getByRole('button', { name: /save crew/i }));

    await waitFor(() => {
      expect(onUpdateFlight).toHaveBeenCalledWith('FL001', {
        crew: {
          pilot: 'Captain Morgan',
          coPilot: 'First Officer Lee',
          cabinCrew: ['Sam Ortiz', 'Priya Shah'],
        },
      });
    });
  });
});