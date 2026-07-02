import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SeatingRecommendationsPanel from '../features/seating/components/SeatingRecommendationsPanel';
import type { Passenger } from '../domain/passengers/types';

const makePassenger = (overrides: Partial<Passenger>): Passenger => ({
  id: 'passenger-1',
  name: 'Grace Okafor',
  seat: '3F',
  flightId: 'flight-1',
  ancillaryServices: [],
  specialMeal: 'standard',
  wheelchair: true,
  infant: false,
  checkedIn: false,
  bookingReference: 'ABC123',
  shopRequests: [],
  ...overrides,
});

describe('SeatingRecommendationsPanel', () => {
  it('applies the aisle-seat recommendation when the action is clicked', async () => {
    const user = userEvent.setup();
    const onApplyRecommendation = jest.fn();
    const passengers = [
      makePassenger({ id: 'passenger-1', seat: '3F', wheelchair: true }),
      makePassenger({ id: 'passenger-2', name: 'Aisle Occupant', seat: '1C', wheelchair: false }),
    ];

    render(
      <SeatingRecommendationsPanel
        passengers={passengers}
        onApplyRecommendation={onApplyRecommendation}
      />
    );

    await user.click(screen.getByRole('button', { name: /move to aisle seat/i }));

    expect(onApplyRecommendation).toHaveBeenCalledWith(expect.objectContaining({
      category: 'assistance',
      passengerIds: ['passenger-1'],
      suggestedSeats: ['1D'],
    }));
  });
});