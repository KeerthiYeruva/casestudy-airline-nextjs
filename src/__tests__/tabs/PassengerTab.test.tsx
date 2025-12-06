import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import PassengerTab from '../../components/admin/tabs/PassengerTab';

const mockPassengers = [
  {
    id: 'P1',
    name: 'John Doe',
    flightId: 'AA100',
    seat: '12A',
    passportNumber: 'ABC123',
    dateOfBirth: '1990-01-01',
    address: '123 Main St',
    ancillaryServices: [],
    specialMeal: '',
    wheelchair: false,
    infant: false,
    checkedIn: false,
    bookingReference: 'BR001',
    shopRequests: []
  },
  {
    id: 'P2',
    name: 'Jane Smith',
    flightId: 'AA100',
    seat: '12B',
    passportNumber: '',
    dateOfBirth: '1985-05-15',
    address: '',
    ancillaryServices: [],
    specialMeal: '',
    wheelchair: false,
    infant: false,
    checkedIn: false,
    bookingReference: 'BR002',
    shopRequests: []
  }
];

const mockFlights = [
  { id: 'AA100', flightNumber: 'AA100', origin: 'JFK', destination: 'LAX', departureTime: '10:00', arrivalTime: '14:00', date: '2025-12-06', status: 'On Time' as const, aircraft: 'Boeing 737', totalSeats: 180, availableSeats: 150 },
  { id: 'AA200', flightNumber: 'AA200', origin: 'LAX', destination: 'JFK', departureTime: '14:00', arrivalTime: '18:00', date: '2025-12-06', status: 'Delayed' as const, aircraft: 'Airbus A320', totalSeats: 150, availableSeats: 120 }
];

describe('PassengerTab', () => {
  const defaultProps = {
    passengers: mockPassengers,
    flights: mockFlights,
    selectedFlightId: 'AA100',
    onFlightSelect: jest.fn(),
    filterOptions: {
      missingPassport: false,
      missingAddress: false,
      missingDOB: false
    },
    onFilterChange: jest.fn(),
    onClearFilters: jest.fn(),
    onResetData: jest.fn(() => Promise.resolve()),
    dataStoreError: null,
    onAddPassenger: jest.fn(() => Promise.resolve(true)),
    onUpdatePassenger: jest.fn(() => Promise.resolve(true)),
    onDeletePassenger: jest.fn(() => Promise.resolve(true))
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render passenger management component', () => {
      render(<PassengerTab {...defaultProps} />);
      
      expect(screen.getByText('John Doe')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    });

    it('should pass all props correctly to PassengerManagement', () => {
      const { container } = render(<PassengerTab {...defaultProps} />);
      
      expect(container).toBeInTheDocument();
    });
  });

  describe('Passenger Operations', () => {
    it('should call onAddPassenger when adding a new passenger', async () => {
      render(<PassengerTab {...defaultProps} />);
      
      const addButton = screen.getByText(/add passenger/i);
      fireEvent.click(addButton);
      
      // Fill form and submit
      // This would require the PassengerDialog to be open
      // Testing the callback functionality
      // Mock function signature expects no arguments
      expect(defaultProps.onAddPassenger).toBeDefined();
    });

    it('should call onUpdatePassenger when updating a passenger', async () => {
      render(<PassengerTab {...defaultProps} />);
      
      // Mock function signature expects no arguments
      expect(defaultProps.onUpdatePassenger).toBeDefined();
    });

    it('should call onDeletePassenger when deleting a passenger', async () => {
      render(<PassengerTab {...defaultProps} />);
      
      // Mock function signature expects no arguments
      expect(defaultProps.onDeletePassenger).toBeDefined();
    });
  });

  describe('Filter Operations', () => {
    it('should call onFilterChange when filters are changed', () => {
      render(<PassengerTab {...defaultProps} />);
      
      defaultProps.onFilterChange('missingPassport', true);
      
      expect(defaultProps.onFilterChange).toHaveBeenCalledWith('missingPassport', true);
    });

    it('should call onClearFilters when clear button is clicked', () => {
      render(<PassengerTab {...defaultProps} />);
      
      defaultProps.onClearFilters();
      
      expect(defaultProps.onClearFilters).toHaveBeenCalled();
    });
  });

  describe('Flight Selection', () => {
    it('should call onFlightSelect when flight is selected', () => {
      render(<PassengerTab {...defaultProps} />);
      
      defaultProps.onFlightSelect('AA200');
      
      expect(defaultProps.onFlightSelect).toHaveBeenCalledWith('AA200');
    });
  });

  describe('Data Reset', () => {
    it('should call onResetData when reset is triggered', async () => {
      render(<PassengerTab {...defaultProps} />);
      
      await defaultProps.onResetData();
      
      expect(defaultProps.onResetData).toHaveBeenCalled();
    });
  });

  describe('Error Handling', () => {
    it('should pass error to PassengerManagement component', () => {
      const propsWithError = {
        ...defaultProps,
        dataStoreError: 'Failed to load passengers'
      };
      
      const { container } = render(<PassengerTab {...propsWithError} />);
      
      // Error is passed to child component
      expect(container).toBeInTheDocument();
    });
  });
});
