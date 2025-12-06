import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from '../components/AdminDashboard';

// Mock the stores
jest.mock('@/stores/useDataStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    flights: [
      { id: 'AA100', origin: 'JFK', destination: 'LAX', departureTime: '10:00', status: 'On Time' }
    ],
    passengers: [
      { id: 'P1', name: 'John Doe', flightId: 'AA100', seat: '12A', passportNumber: 'ABC123', dateOfBirth: '1990-01-01', address: '123 Main St' }
    ],
    ancillaryServices: ['WiFi', 'Extra Legroom'],
    mealOptions: ['Vegetarian', 'Non-Vegetarian'],
    shopItems: [
      { id: 'SHOP1', name: 'Perfume', category: 'Perfumes & Cosmetics', price: 50, currency: 'USD' }
    ],
    error: null,
    fetchFlights: jest.fn(),
    fetchPassengers: jest.fn(),
    addPassenger: jest.fn(() => Promise.resolve(true)),
    updatePassenger: jest.fn(() => Promise.resolve(true)),
    deletePassenger: jest.fn(() => Promise.resolve(true)),
    setAncillaryServices: jest.fn(),
    setMealOptions: jest.fn(),
    setShopItems: jest.fn(),
    resetToInitialData: jest.fn(() => Promise.resolve()),
  })),
}));

jest.mock('@/stores/useAdminStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    selectedFlight: null,
    filterOptions: {},
    selectFlight: jest.fn(),
    setAdminFilter: jest.fn(),
    clearAdminFilters: jest.fn(),
  })),
}));

jest.mock('@/stores/useToastStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    showToast: jest.fn(),
  })),
}));

jest.mock('@/hooks/useRealtimeUpdates', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isConnected: true,
  })),
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render the admin dashboard with all tabs', () => {
      render(<AdminDashboard />);
      
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
      expect(screen.getByText('Passengers')).toBeInTheDocument();
      expect(screen.getByText('Services & Menu')).toBeInTheDocument();
      expect(screen.getByText('Seat Management')).toBeInTheDocument();
    });

    it('should display connection status', () => {
      render(<AdminDashboard />);
      
      expect(screen.getByText('Live Updates')).toBeInTheDocument();
    });

    it('should render passenger tab by default', () => {
      render(<AdminDashboard />);
      
      // Check if passenger management component is visible
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });
  });

  describe('Tab Navigation', () => {
    it('should switch to services & menu tab when clicked', () => {
      render(<AdminDashboard />);
      
      const servicesTab = screen.getByText('Services & Menu');
      fireEvent.click(servicesTab);
      
      // Check if services content is displayed
      expect(screen.getByText('WiFi')).toBeInTheDocument();
      expect(screen.getByText('Extra Legroom')).toBeInTheDocument();
    });

    it('should switch to seat management tab when clicked', () => {
      render(<AdminDashboard />);
      
      const seatTab = screen.getByText('Seat Management');
      fireEvent.click(seatTab);
      
      // Check if seat management content is displayed
      expect(screen.getByText('Advanced Seat Management')).toBeInTheDocument();
    });
  });

  describe('Services & Menu Management', () => {
    beforeEach(() => {
      render(<AdminDashboard />);
      const servicesTab = screen.getByText('Services & Menu');
      fireEvent.click(servicesTab);
    });

    it('should open add service dialog', () => {
      const addButton = screen.getAllByText(/add/i)[0];
      fireEvent.click(addButton);
      
      expect(screen.getByText('Add Service')).toBeInTheDocument();
    });

    it('should display existing ancillary services', () => {
      expect(screen.getByText('WiFi')).toBeInTheDocument();
      expect(screen.getByText('Extra Legroom')).toBeInTheDocument();
    });

    it('should display existing meal options', () => {
      expect(screen.getByText('Vegetarian')).toBeInTheDocument();
      expect(screen.getByText('Non-Vegetarian')).toBeInTheDocument();
    });

    it('should display shop items', () => {
      expect(screen.getByText('Perfume')).toBeInTheDocument();
    });
  });

  describe('Service Dialog Operations', () => {
    it('should add a new service', async () => {
      const mockSetServices = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useDataStoreMock = jest.mocked(require('@/stores/useDataStore').default);
      useDataStoreMock.mockReturnValueOnce({
        ...useDataStoreMock.mock.results[0].value,
        ancillaryServices: ['WiFi'],
        setAncillaryServices: mockSetServices,
      });

      render(<AdminDashboard />);
      
      // Switch to services tab
      const servicesTab = screen.getByText('Services & Menu');
      fireEvent.click(servicesTab);
      
      // Open add service dialog
      const addButton = screen.getAllByText(/add/i)[0];
      fireEvent.click(addButton);
      
      // Type service name
      const input = screen.getByLabelText(/service name/i);
      fireEvent.change(input, { target: { value: 'Priority Boarding' } });
      
      // Save
      const saveButton = screen.getByText(/save/i);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockSetServices).toHaveBeenCalledWith(['WiFi', 'Priority Boarding']);
      });
    });

    it('should not add empty service', async () => {
      const mockShowToast = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useToastStoreMock = jest.mocked(require('@/stores/useToastStore').default);
      useToastStoreMock.mockReturnValueOnce({
        showToast: mockShowToast,
      });

      render(<AdminDashboard />);
      
      const servicesTab = screen.getByText('Services & Menu');
      fireEvent.click(servicesTab);
      
      const addButton = screen.getAllByText(/add/i)[0];
      fireEvent.click(addButton);
      
      const saveButton = screen.getByText(/save/i);
      fireEvent.click(saveButton);
      
      expect(mockShowToast).toHaveBeenCalledWith('Service name cannot be empty', 'error');
    });
  });

  describe('Meal Dialog Operations', () => {
    it('should add a new meal option', async () => {
      const mockSetMeals = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useDataStoreMock = jest.mocked(require('@/stores/useDataStore').default);
      useDataStoreMock.mockReturnValueOnce({
        ...useDataStoreMock.mock.results[0].value,
        mealOptions: ['Vegetarian'],
        setMealOptions: mockSetMeals,
      });

      render(<AdminDashboard />);
      
      const servicesTab = screen.getByText('Services & Menu');
      fireEvent.click(servicesTab);
      
      // Find and click add meal button (second add button)
      const addButtons = screen.getAllByText(/add/i);
      fireEvent.click(addButtons[1]);
      
      const input = screen.getByLabelText(/meal name/i);
      fireEvent.change(input, { target: { value: 'Vegan' } });
      
      const saveButton = screen.getByText(/save/i);
      fireEvent.click(saveButton);
      
      await waitFor(() => {
        expect(mockSetMeals).toHaveBeenCalledWith(['Vegetarian', 'Vegan']);
      });
    });

    it('should not add empty meal option', async () => {
      const mockShowToast = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useToastStoreMock = jest.mocked(require('@/stores/useToastStore').default);
      useToastStoreMock.mockReturnValueOnce({
        showToast: mockShowToast,
      });

      render(<AdminDashboard />);
      
      const servicesTab = screen.getByText('Services & Menu');
      fireEvent.click(servicesTab);
      
      const addButtons = screen.getAllByText(/add/i);
      fireEvent.click(addButtons[1]);
      
      const saveButton = screen.getByText(/save/i);
      fireEvent.click(saveButton);
      
      expect(mockShowToast).toHaveBeenCalledWith('Meal option name cannot be empty', 'error');
    });
  });

  describe('Shop Item Dialog Operations', () => {
    it('should validate shop item form', async () => {
      const mockShowToast = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useToastStoreMock = jest.mocked(require('@/stores/useToastStore').default);
      useToastStoreMock.mockReturnValueOnce({
        showToast: mockShowToast,
      });

      render(<AdminDashboard />);
      
      const servicesTab = screen.getByText('Services & Menu');
      fireEvent.click(servicesTab);
      
      // Open add shop item dialog
      const addButtons = screen.getAllByText(/add/i);
      fireEvent.click(addButtons[2]);
      
      // Try to save without filling required fields
      const saveButton = screen.getByText(/save/i);
      fireEvent.click(saveButton);
      
      expect(mockShowToast).toHaveBeenCalledWith('Item name is required', 'error');
    });
  });

  describe('Delete Operations', () => {
    it('should show confirmation dialog when deleting service', () => {
      render(<AdminDashboard />);
      
      const servicesTab = screen.getByText('Services & Menu');
      fireEvent.click(servicesTab);
      
      // Find and click delete button for a service
      const deleteButtons = screen.getAllByLabelText(/delete/i);
      if (deleteButtons.length > 0) {
        fireEvent.click(deleteButtons[0]);
        
        expect(screen.getByText(/Delete/i)).toBeInTheDocument();
      }
    });
  });

  describe('Seat Management Tab', () => {
    beforeEach(() => {
      render(<AdminDashboard />);
      const seatTab = screen.getByText('Seat Management');
      fireEvent.click(seatTab);
    });

    it('should display seat preferences section', () => {
      expect(screen.getByText('Seat Preferences')).toBeInTheDocument();
    });

    it('should display group seating section', () => {
      expect(screen.getByText('Group Seating')).toBeInTheDocument();
    });

    it('should display family seating section', () => {
      expect(screen.getByText('Family Seating')).toBeInTheDocument();
    });

    it('should display premium seat upsell section', () => {
      expect(screen.getByText('Premium Seat Upsell')).toBeInTheDocument();
    });

    it('should have action buttons', () => {
      expect(screen.getByText('Set Seat Preferences')).toBeInTheDocument();
      expect(screen.getByText('Offer Premium Upgrade')).toBeInTheDocument();
    });
  });

  describe('Data Fetching', () => {
    it('should fetch flights and passengers on mount', () => {
      const mockFetchFlights = jest.fn();
      const mockFetchPassengers = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useDataStoreMock = jest.mocked(require('@/stores/useDataStore').default);
      
      useDataStoreMock.mockReturnValueOnce({
        ...useDataStoreMock.mock.results[0].value,
        flights: [],
        passengers: [],
        fetchFlights: mockFetchFlights,
        fetchPassengers: mockFetchPassengers,
      });

      render(<AdminDashboard />);
      
      expect(mockFetchFlights).toHaveBeenCalled();
      expect(mockFetchPassengers).toHaveBeenCalled();
    });

    it('should not fetch if data already exists', () => {
      const mockFetchFlights = jest.fn();
      const mockFetchPassengers = jest.fn();
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useDataStoreMock = jest.mocked(require('@/stores/useDataStore').default);
      
      useDataStoreMock.mockReturnValueOnce({
        ...useDataStoreMock.mock.results[0].value,
        flights: [{ id: 'AA100' }],
        passengers: [{ id: 'P1' }],
        fetchFlights: mockFetchFlights,
        fetchPassengers: mockFetchPassengers,
      });

      render(<AdminDashboard />);
      
      // Should not be called since data exists
      expect(mockFetchFlights).not.toHaveBeenCalled();
      expect(mockFetchPassengers).not.toHaveBeenCalled();
    });
  });

  describe('Confirm Dialog', () => {
    it('should close confirm dialog on cancel', async () => {
      render(<AdminDashboard />);
      
      const servicesTab = screen.getByText('Services & Menu');
      fireEvent.click(servicesTab);
      
      // Try to delete a service
      const deleteButtons = screen.getAllByLabelText(/delete/i);
      if (deleteButtons.length > 0) {
        fireEvent.click(deleteButtons[0]);
        
        // Find and click cancel button
        const cancelButton = screen.getByText(/cancel/i);
        fireEvent.click(cancelButton);
        
        await waitFor(() => {
          expect(screen.queryByText(/Delete/i)).not.toBeInTheDocument();
        });
      }
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      render(<AdminDashboard />);
      
      const tabs = screen.getAllByRole('tab');
      expect(tabs.length).toBeGreaterThan(0);
    });

    it('should support keyboard navigation', () => {
      render(<AdminDashboard />);
      
      const firstTab = screen.getByText('Passengers');
      firstTab.focus();
      expect(document.activeElement).toBe(firstTab);
    });
  });
});
