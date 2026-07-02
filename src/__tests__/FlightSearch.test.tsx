import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FlightSearch from '../features/customer/components/FlightSearch';
import type { Flight } from '../domain/flights/types';
import type { Passenger } from '../domain/passengers/types';

jest.setTimeout(15000);

const mockFetchFlights = jest.fn();
const mockFetchPassengers = jest.fn();
const mockAddPassenger = jest.fn();
const mockFetchCatalog = jest.fn();

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
    totalSeats: 12,
    availableSeats: 11,
  },
  {
    id: 'FL002',
    flightNumber: 'BB202',
    origin: 'Chicago (ORD)',
    destination: 'Miami (MIA)',
    departureTime: '12:30 PM',
    arrivalTime: '04:45 PM',
    date: '2025-12-03',
    status: 'Boarding',
    aircraft: 'Airbus A320',
    gate: 'B5',
    terminal: '2',
    totalSeats: 12,
    availableSeats: 12,
  },
  {
    id: 'FL003',
    flightNumber: 'CC303',
    origin: 'New York (JFK)',
    destination: 'Los Angeles (LAX)',
    departureTime: '03:15 PM',
    arrivalTime: '06:45 PM',
    date: '2025-12-03',
    status: 'Cancelled',
    aircraft: 'Boeing 787',
    gate: 'C8',
    terminal: '1',
    totalSeats: 12,
    availableSeats: 12,
  },
];

const mockPassengers: Passenger[] = [
  {
    id: 'P001',
    name: 'Existing Passenger',
    seat: '1A',
    flightId: 'FL001',
    ancillaryServices: [],
    specialMeal: 'Regular',
    wheelchair: false,
    infant: false,
    checkedIn: false,
    bookingReference: 'EXI101',
    shopRequests: [],
  },
];

jest.mock('../stores/useDataStore', () => ({
  __esModule: true,
  default: () => ({
    flights: mockFlights,
    passengers: mockPassengers,
    ancillaryServices: ['Extra Baggage', 'Lounge Access', 'Wi-Fi Access'],
    mealOptions: ['Regular', 'Vegetarian', 'Vegan'],
    fetchFlights: mockFetchFlights,
    fetchPassengers: mockFetchPassengers,
    fetchCatalog: mockFetchCatalog,
    addPassenger: mockAddPassenger,
  }),
}));

const fillPaymentDetails = () => {
  fireEvent.change(screen.getByLabelText(/cardholder name/i), { target: { value: 'Maya Patel' } });
  fireEvent.change(screen.getByLabelText(/card number/i), { target: { value: '4242424242424242' } });
  fireEvent.change(screen.getByLabelText(/expiry date/i), { target: { value: '1230' } });
  fireEvent.change(screen.getByLabelText(/security code/i), { target: { value: '123' } });
};

const confirmBooking = async () => {
  const confirmButton = screen.getByRole('button', { name: /confirm booking/i });
  await waitFor(() => expect(confirmButton).toBeEnabled(), { timeout: 500 });
  fireEvent.click(confirmButton);
};

const selectRouteOption = (label: string, option: string) => {
  fireEvent.mouseDown(screen.getByRole('combobox', { name: label }));
  fireEvent.click(screen.getByRole('option', { name: option }));
};

describe('FlightSearch', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockFetchFlights.mockResolvedValue(undefined);
    mockFetchPassengers.mockResolvedValue(undefined);
    mockFetchCatalog.mockResolvedValue(undefined);
    mockAddPassenger.mockResolvedValue({
      id: 'P100',
      name: 'Maya Patel',
      seat: '1B',
      flightId: 'FL001',
      ancillaryServices: [],
      specialMeal: 'Regular',
      wheelchair: false,
      infant: false,
      checkedIn: false,
      bookingReference: 'MAY1012',
      shopRequests: [],
    });
  });

  it('renders search controls and featured flights', () => {
    render(<FlightSearch />);

    expect(screen.getByRole('heading', { name: /flight search/i })).toBeInTheDocument();
    expect(screen.getByLabelText('From')).toBeInTheDocument();
    expect(screen.getByLabelText('To')).toBeInTheDocument();
    expect(screen.getByText('AA101')).toBeInTheDocument();
    expect(screen.getByText('BB202')).toBeInTheDocument();
  });

  it('filters bookable flights by route and date', () => {
    render(<FlightSearch />);

    selectRouteOption('From', 'New York (JFK)');
    selectRouteOption('To', 'Los Angeles (LAX)');
    fireEvent.change(screen.getByLabelText('Departure Date'), { target: { value: '2025-12-03' } });
    fireEvent.click(screen.getByRole('button', { name: /search flights/i }));

    expect(screen.getByText('1 matching flights')).toBeInTheDocument();
    expect(screen.getByText('AA101')).toBeInTheDocument();
    expect(screen.queryByText('BB202')).not.toBeInTheDocument();
    expect(screen.queryByText('CC303')).not.toBeInTheDocument();
  });

  it('creates a booking from a selected flight', async () => {
    render(<FlightSearch />);

    fireEvent.click(screen.getAllByRole('button', { name: /select flight/i })[0]);
    expect(await screen.findByRole('dialog', { name: /book aa101/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/passenger name/i), { target: { value: 'Maya Patel' } });
    fillPaymentDetails();
    await confirmBooking();

    await waitFor(() => {
      expect(mockAddPassenger).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Maya Patel',
        flightId: 'FL001',
        seat: '1B',
        checkedIn: false,
        specialMeal: 'Regular',
      }));
    });

    expect(await screen.findByText(/booking created for maya patel/i)).toBeInTheDocument();
    expect(screen.getByText('MAY1012')).toBeInTheDocument();
  });

  it('lets the passenger choose a seat during booking', async () => {
    render(<FlightSearch />);

    fireEvent.click(screen.getAllByRole('button', { name: /select flight/i })[0]);
    expect(await screen.findByRole('dialog', { name: /book aa101/i })).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /seat 2a/i }));
    fireEvent.change(screen.getByLabelText(/passenger name/i), { target: { value: 'Maya Patel' } });
    fillPaymentDetails();
    await confirmBooking();

    await waitFor(() => {
      expect(mockAddPassenger).toHaveBeenCalledWith(expect.objectContaining({
        name: 'Maya Patel',
        flightId: 'FL001',
        seat: '2A',
      }));
    });
  });

  it('saves selected booking add-ons with the passenger', async () => {
    render(<FlightSearch />);

    fireEvent.click(screen.getAllByRole('button', { name: /select flight/i })[0]);
    expect(await screen.findByRole('dialog', { name: /book aa101/i })).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/extra baggage \$65/i));
    fireEvent.click(screen.getByLabelText(/lounge access \$89/i));
    fireEvent.change(screen.getByLabelText(/passenger name/i), { target: { value: 'Maya Patel' } });
    fillPaymentDetails();
    await confirmBooking();

    await waitFor(() => {
      expect(mockAddPassenger).toHaveBeenCalledWith(expect.objectContaining({
        ancillaryServices: expect.arrayContaining(['Extra Baggage', 'Lounge Access']),
      }));
    });
  });

  it('requires payment details before confirming a booking', async () => {
    render(<FlightSearch />);

    fireEvent.click(screen.getAllByRole('button', { name: /select flight/i })[0]);
    expect(await screen.findByRole('dialog', { name: /book aa101/i })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText(/passenger name/i), { target: { value: 'Maya Patel' } });

    expect(screen.getByRole('button', { name: /confirm booking/i })).toBeDisabled();
    expect(mockAddPassenger).not.toHaveBeenCalled();
  });
});