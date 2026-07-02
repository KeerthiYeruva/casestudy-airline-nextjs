import type { Meta, StoryObj } from '@storybook/nextjs';
import FlightInfoGrid from '../../components/ui/FlightInfoGrid';
import type { Flight } from '../../types/flight';

const flight: Flight = {
  id: 'AA101',
  name: 'American Airlines 101',
  flightNumber: 'AA101',
  origin: 'NYC',
  destination: 'LAX',
  from: 'New York',
  to: 'Los Angeles',
  departureTime: '08:00 AM',
  arrivalTime: '11:15 AM',
  time: '08:00 AM',
  date: '2026-07-01',
  status: 'Boarding',
  aircraft: 'Boeing 737',
  gate: 'A12',
  terminal: '1',
  totalSeats: 180,
  availableSeats: 42,
};

const meta = {
  title: 'UI/FlightInfoGrid',
  component: FlightInfoGrid,
  args: {
    flight,
  },
} satisfies Meta<typeof FlightInfoGrid>;

export default meta;

type Story = StoryObj<typeof meta>;

export const BoardingFlight: Story = {};

export const CancelledFlight: Story = {
  args: {
    flight: {
      ...flight,
      status: 'Cancelled',
      gate: 'N/A',
    },
  },
};