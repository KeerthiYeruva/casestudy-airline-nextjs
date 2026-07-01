import type { SeatMap } from './seat';

export interface Flight {
  id: string;
  name?: string;
  flightNumber: string;
  origin: string;
  destination: string;
  from?: string;
  to?: string;
  departureTime: string;
  arrivalTime: string;
  time?: string;
  date: string;
  status: 'On Time' | 'Delayed' | 'Boarding' | 'Departed' | 'Arrived' | 'Cancelled';
  aircraft: string;
  gate?: string;
  terminal?: string;
  totalSeats: number;
  availableSeats: number;
  seatMap?: SeatMap[];
  premiumSeats?: string[];
}
