import type { SeatMap } from './seat';

export interface CrewAssignment {
  pilot: string;
  coPilot: string;
  cabinCrew: string[];
}

export type AircraftStatus = 'Active' | 'Maintenance' | 'Out of Service';

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
  aircraftStatus?: AircraftStatus;
  seatLayout?: string;
  gate?: string;
  terminal?: string;
  totalSeats: number;
  availableSeats: number;
  crew?: CrewAssignment;
  seatMap?: SeatMap[];
  premiumSeats?: string[];
}
