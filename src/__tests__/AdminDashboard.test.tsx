import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import AdminDashboard from '../features/admin/components/AdminDashboard';

const mockDataStoreState = {
  flights: [
    { id: 'AA100', flightNumber: 'AA100', origin: 'JFK', destination: 'LAX', departureTime: '10:00', status: 'On Time', totalSeats: 180 }
  ],
  passengers: [
    {
      id: 'P1',
      name: 'John Doe',
      flightId: 'AA100',
      seat: '12A',
      passportNumber: 'ABC123',
      dateOfBirth: '1990-01-01',
      address: '123 Main St',
      ancillaryServices: [],
      shopRequests: [],
    }
  ],
  ancillaryServices: ['WiFi', 'Extra Legroom'],
  mealOptions: ['Vegetarian', 'Non-Vegetarian'],
  shopItems: [
    { id: 'SHOP1', name: 'Perfume', category: 'Perfumes & Cosmetics', price: 50, currency: 'USD' }
  ],
  shopCategories: ['Perfumes & Cosmetics'],
  loading: false,
  error: null,
  fetchFlights: jest.fn(() => Promise.resolve()),
  fetchPassengers: jest.fn(() => Promise.resolve()),
  fetchCatalog: jest.fn(() => Promise.resolve()),
  addFlight: jest.fn(() => Promise.resolve({ id: 'AA101', flightNumber: 'AA101' })),
  updateFlight: jest.fn((id, updates) => Promise.resolve({ id, flightNumber: 'AA100', ...updates })),
  deleteFlight: jest.fn((id) => Promise.resolve({ id, flightNumber: 'AA100' })),
  addPassenger: jest.fn((passenger) => Promise.resolve({ id: 'P2', ...passenger })),
  updatePassenger: jest.fn((id, updates) => Promise.resolve({ id, ...updates })),
  deletePassenger: jest.fn((id) => Promise.resolve({ id })),
  checkInPassenger: jest.fn(() => Promise.resolve(null)),
  undoCheckIn: jest.fn(() => Promise.resolve(null)),
  changeSeat: jest.fn(() => Promise.resolve(null)),
  addAncillaryService: jest.fn((service) => Promise.resolve(service)),
  updateAncillaryService: jest.fn((_, service) => Promise.resolve(service)),
  deleteAncillaryService: jest.fn((service) => Promise.resolve(service)),
  addMealOption: jest.fn((meal) => Promise.resolve(meal)),
  updateMealOption: jest.fn((_, meal) => Promise.resolve(meal)),
  deleteMealOption: jest.fn((meal) => Promise.resolve(meal)),
  addShopItem: jest.fn((item) => Promise.resolve(item)),
  updateShopItem: jest.fn((id, updates) => Promise.resolve({ id, ...updates })),
  deleteShopItem: jest.fn((id) => Promise.resolve({ id })),
  setFlights: jest.fn(),
  setPassengers: jest.fn(),
  setAncillaryServices: jest.fn(),
  setMealOptions: jest.fn(),
  setShopItems: jest.fn(),
  setShopCategories: jest.fn(),
  resetToInitialData: jest.fn(() => Promise.resolve()),
  addAncillaryServiceToPassenger: jest.fn(() => Promise.resolve()),
  removeAncillaryServiceFromPassenger: jest.fn(() => Promise.resolve()),
  changeMealPreference: jest.fn(() => Promise.resolve()),
  addShopRequest: jest.fn(() => Promise.resolve()),
  removeShopRequest: jest.fn(() => Promise.resolve()),
  updateSeatPreferences: jest.fn(() => Promise.resolve()),
  allocateGroupSeating: jest.fn(() => Promise.resolve()),
  allocateFamilySeating: jest.fn(() => Promise.resolve()),
  upgradeToPremium: jest.fn(() => Promise.resolve()),
  getPremiumSeatUpsells: jest.fn(() => []),
};

const mockToastStoreState = {
  showToast: jest.fn(),
};

// Mock the stores
jest.mock('../stores/useDataStore', () => ({
  __esModule: true,
  default: jest.fn(() => mockDataStoreState),
}));

jest.mock('../stores/useAdminStore', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    selectedFlight: null,
    filterOptions: {},
    selectFlight: jest.fn(),
    setAdminFilter: jest.fn(),
    clearAdminFilters: jest.fn(),
  })),
}));

jest.mock('../stores/useToastStore', () => ({
  __esModule: true,
  default: jest.fn(() => mockToastStoreState),
}));

jest.mock('../hooks/useRealtimeUpdates', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isConnected: true,
  })),
}));

describe('AdminDashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.mocked(require('../stores/useDataStore').default).mockReturnValue(mockDataStoreState);
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    jest.mocked(require('../stores/useToastStore').default).mockReturnValue(mockToastStoreState);
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
      const mockAddService = jest.fn(() => Promise.resolve('Priority Boarding'));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useDataStoreMock = jest.mocked(require('../stores/useDataStore').default);
      useDataStoreMock.mockReturnValue({
        ...mockDataStoreState,
        ancillaryServices: ['WiFi'],
        addAncillaryService: mockAddService,
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
      const dialog = screen.getByRole('dialog');
      const addDialogButton = within(dialog).getByRole('button', { name: /add/i });
      fireEvent.click(addDialogButton);
      
      await waitFor(() => {
        expect(mockAddService).toHaveBeenCalledWith('Priority Boarding');
      });
    });

    it('should edit an existing service', async () => {
      const mockUpdateService = jest.fn(() => Promise.resolve('Fast WiFi'));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useDataStoreMock = jest.mocked(require('../stores/useDataStore').default);
      useDataStoreMock.mockReturnValue({
        ...mockDataStoreState,
        updateAncillaryService: mockUpdateService,
      });

      render(<AdminDashboard />);

      fireEvent.click(screen.getByText('Services & Menu'));
      fireEvent.click(screen.getByLabelText('Edit WiFi'));

      const input = screen.getByLabelText(/service name/i);
      fireEvent.change(input, { target: { value: 'Fast WiFi' } });

      const dialog = screen.getByRole('dialog');
      fireEvent.click(within(dialog).getByRole('button', { name: /update/i }));

      await waitFor(() => {
        expect(mockUpdateService).toHaveBeenCalledWith('WiFi', 'Fast WiFi');
      });
    });

    it('should delete an existing service after confirmation', async () => {
      const mockDeleteService = jest.fn(() => Promise.resolve('Extra Legroom'));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useDataStoreMock = jest.mocked(require('../stores/useDataStore').default);
      useDataStoreMock.mockReturnValue({
        ...mockDataStoreState,
        deleteAncillaryService: mockDeleteService,
      });

      render(<AdminDashboard />);

      fireEvent.click(screen.getByText('Services & Menu'));
      fireEvent.click(screen.getByLabelText('Delete Extra Legroom'));
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(() => {
        expect(mockDeleteService).toHaveBeenCalledWith('Extra Legroom');
      });
    });

    it('should not add empty service', async () => {
      render(<AdminDashboard />);
      
      const servicesTab = screen.getByText('Services & Menu');
      fireEvent.click(servicesTab);
      
      const addButton = screen.getAllByText(/add/i)[0];
      fireEvent.click(addButton);
      
      const dialog = screen.getByRole('dialog');
      const addDialogButton = within(dialog).getByRole('button', { name: /add/i });
      fireEvent.click(addDialogButton);
      
      expect(mockToastStoreState.showToast).toHaveBeenCalledWith('Service name cannot be empty', 'error');
    });
  });

  describe('Meal Dialog Operations', () => {
    it('should protect the default Regular meal option from edit and delete actions', () => {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useDataStoreMock = jest.mocked(require('../stores/useDataStore').default);
      useDataStoreMock.mockReturnValue({
        ...mockDataStoreState,
        mealOptions: ['Regular', 'Vegetarian'],
      });

      render(<AdminDashboard />);

      fireEvent.click(screen.getByText('Services & Menu'));

      expect(screen.getByText('Default')).toBeInTheDocument();
      expect(screen.queryByLabelText('Edit Regular')).not.toBeInTheDocument();
      expect(screen.queryByLabelText('Delete Regular')).not.toBeInTheDocument();
      expect(screen.getByLabelText('Edit Vegetarian')).toBeInTheDocument();
      expect(screen.getByLabelText('Delete Vegetarian')).toBeInTheDocument();
    });

    it('should add a new meal option', async () => {
      const mockAddMeal = jest.fn(() => Promise.resolve('Vegan'));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useDataStoreMock = jest.mocked(require('../stores/useDataStore').default);
      useDataStoreMock.mockReturnValue({
        ...mockDataStoreState,
        mealOptions: ['Vegetarian'],
        addMealOption: mockAddMeal,
      });

      render(<AdminDashboard />);
      
      const servicesTab = screen.getByText('Services & Menu');
      fireEvent.click(servicesTab);
      
      // Find and click add meal button (second add button)
      const addButtons = screen.getAllByText(/add/i);
      fireEvent.click(addButtons[1]);
      
      const input = screen.getByLabelText(/meal name/i);
      fireEvent.change(input, { target: { value: 'Vegan' } });
      
      const dialog = screen.getByRole('dialog');
      const addDialogButton = within(dialog).getByRole('button', { name: /add/i });
      fireEvent.click(addDialogButton);
      
      await waitFor(() => {
        expect(mockAddMeal).toHaveBeenCalledWith('Vegan');
      });
    });

    it('should edit an existing meal option', async () => {
      const mockUpdateMeal = jest.fn(() => Promise.resolve('Jain Vegetarian'));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useDataStoreMock = jest.mocked(require('../stores/useDataStore').default);
      useDataStoreMock.mockReturnValue({
        ...mockDataStoreState,
        updateMealOption: mockUpdateMeal,
      });

      render(<AdminDashboard />);

      fireEvent.click(screen.getByText('Services & Menu'));
      fireEvent.click(screen.getByLabelText('Edit Vegetarian'));

      const input = screen.getByLabelText(/meal name/i);
      fireEvent.change(input, { target: { value: 'Jain Vegetarian' } });

      const dialog = screen.getByRole('dialog');
      fireEvent.click(within(dialog).getByRole('button', { name: /update/i }));

      await waitFor(() => {
        expect(mockUpdateMeal).toHaveBeenCalledWith('Vegetarian', 'Jain Vegetarian');
      });
    });

    it('should delete an existing meal option after confirmation', async () => {
      const mockDeleteMeal = jest.fn(() => Promise.resolve('Non-Vegetarian'));
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const useDataStoreMock = jest.mocked(require('../stores/useDataStore').default);
      useDataStoreMock.mockReturnValue({
        ...mockDataStoreState,
        deleteMealOption: mockDeleteMeal,
      });

      render(<AdminDashboard />);

      fireEvent.click(screen.getByText('Services & Menu'));
      fireEvent.click(screen.getByLabelText('Delete Non-Vegetarian'));
      fireEvent.click(screen.getByRole('button', { name: /confirm/i }));

      await waitFor(() => {
        expect(mockDeleteMeal).toHaveBeenCalledWith('Non-Vegetarian');
      });
    });

    it('should not add empty meal option', async () => {
      render(<AdminDashboard />);
      
      const servicesTab = screen.getByText('Services & Menu');
      fireEvent.click(servicesTab);
      
      const addButtons = screen.getAllByText(/add/i);
      fireEvent.click(addButtons[1]);
      
      const dialog = screen.getByRole('dialog');
      const addDialogButton = within(dialog).getByRole('button', { name: /add/i });
      fireEvent.click(addDialogButton);
      
      expect(mockToastStoreState.showToast).toHaveBeenCalledWith('Meal option name cannot be empty', 'error');
    });
  });

  describe('Shop Item Dialog Operations', () => {
    it('should validate shop item form', async () => {
      render(<AdminDashboard />);
      
      const servicesTab = screen.getByText('Services & Menu');
      fireEvent.click(servicesTab);
      
      // Open add shop item dialog
      const addButtons = screen.getAllByText(/add/i);
      fireEvent.click(addButtons[2]);
      
      // Try to save without filling required fields
      const dialog = screen.getByRole('dialog');
      const addButton = within(dialog).getByRole('button', { name: /add/i });
      fireEvent.click(addButton);
      
      expect(await screen.findByText('Item name is required')).toBeInTheDocument();
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
        
        expect(screen.getByRole('heading', { name: 'Delete Service' })).toBeInTheDocument();
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
      const useDataStoreMock = jest.mocked(require('../stores/useDataStore').default);
      
      useDataStoreMock.mockReturnValueOnce({
        ...mockDataStoreState,
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
      const useDataStoreMock = jest.mocked(require('../stores/useDataStore').default);
      
      useDataStoreMock.mockReturnValueOnce({
        ...mockDataStoreState,
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
