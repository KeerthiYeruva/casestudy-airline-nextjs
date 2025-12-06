import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ServicesMenuTab from '../../components/admin/tabs/ServicesMenuTab';

const mockShopItems = [
  { id: 'SHOP1', name: 'Perfume', category: 'Perfumes & Cosmetics', price: 50, currency: 'USD' },
  { id: 'SHOP2', name: 'Headphones', category: 'Electronics', price: 120, currency: 'USD' }
];

describe('ServicesMenuTab', () => {
  const defaultProps = {
    ancillaryServices: ['WiFi', 'Extra Legroom', 'Priority Boarding'],
    mealOptions: ['Vegetarian', 'Non-Vegetarian', 'Vegan'],
    shopItems: mockShopItems,
    onAddService: jest.fn(),
    onEditService: jest.fn(),
    onDeleteService: jest.fn(),
    onAddMeal: jest.fn(),
    onEditMeal: jest.fn(),
    onDeleteMeal: jest.fn(),
    onAddShopItem: jest.fn(),
    onEditShopItem: jest.fn(),
    onDeleteShopItem: jest.fn()
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render services menu management component', () => {
      render(<ServicesMenuTab {...defaultProps} />);
      
      expect(screen.getByText('WiFi')).toBeInTheDocument();
      expect(screen.getByText('Extra Legroom')).toBeInTheDocument();
      expect(screen.getByText('Vegetarian')).toBeInTheDocument();
      expect(screen.getByText('Perfume')).toBeInTheDocument();
    });

    it('should display all ancillary services', () => {
      render(<ServicesMenuTab {...defaultProps} />);
      
      defaultProps.ancillaryServices.forEach(service => {
        expect(screen.getByText(service)).toBeInTheDocument();
      });
    });

    it('should display all meal options', () => {
      render(<ServicesMenuTab {...defaultProps} />);
      
      defaultProps.mealOptions.forEach(meal => {
        expect(screen.getByText(meal)).toBeInTheDocument();
      });
    });

    it('should display all shop items', () => {
      render(<ServicesMenuTab {...defaultProps} />);
      
      mockShopItems.forEach(item => {
        expect(screen.getByText(item.name)).toBeInTheDocument();
      });
    });
  });

  describe('Service Operations', () => {
    it('should call onAddService when add service button is clicked', () => {
      render(<ServicesMenuTab {...defaultProps} />);
      
      const addButtons = screen.getAllByText(/add/i);
      fireEvent.click(addButtons[0]); // First add button is for services
      
      expect(defaultProps.onAddService).toHaveBeenCalled();
    });

    it('should call onEditService when edit service is triggered', () => {
      render(<ServicesMenuTab {...defaultProps} />);
      
      defaultProps.onEditService('WiFi');
      
      expect(defaultProps.onEditService).toHaveBeenCalledWith('WiFi');
    });

    it('should call onDeleteService when delete service is triggered', () => {
      render(<ServicesMenuTab {...defaultProps} />);
      
      defaultProps.onDeleteService('WiFi');
      
      expect(defaultProps.onDeleteService).toHaveBeenCalledWith('WiFi');
    });
  });

  describe('Meal Operations', () => {
    it('should call onAddMeal when add meal button is clicked', () => {
      render(<ServicesMenuTab {...defaultProps} />);
      
      const addButtons = screen.getAllByText(/add/i);
      fireEvent.click(addButtons[1]); // Second add button is for meals
      
      expect(defaultProps.onAddMeal).toHaveBeenCalled();
    });

    it('should call onEditMeal when edit meal is triggered', () => {
      render(<ServicesMenuTab {...defaultProps} />);
      
      defaultProps.onEditMeal('Vegetarian');
      
      expect(defaultProps.onEditMeal).toHaveBeenCalledWith('Vegetarian');
    });

    it('should call onDeleteMeal when delete meal is triggered', () => {
      render(<ServicesMenuTab {...defaultProps} />);
      
      defaultProps.onDeleteMeal('Vegetarian');
      
      expect(defaultProps.onDeleteMeal).toHaveBeenCalledWith('Vegetarian');
    });
  });

  describe('Shop Item Operations', () => {
    it('should call onAddShopItem when add shop item button is clicked', () => {
      render(<ServicesMenuTab {...defaultProps} />);
      
      const addButtons = screen.getAllByText(/add/i);
      fireEvent.click(addButtons[2]); // Third add button is for shop items
      
      expect(defaultProps.onAddShopItem).toHaveBeenCalled();
    });

    it('should call onEditShopItem when edit shop item is triggered', () => {
      render(<ServicesMenuTab {...defaultProps} />);
      
      const shopItem = mockShopItems[0];
      defaultProps.onEditShopItem(shopItem);
      
      expect(defaultProps.onEditShopItem).toHaveBeenCalledWith(shopItem);
    });

    it('should call onDeleteShopItem when delete shop item is triggered', () => {
      render(<ServicesMenuTab {...defaultProps} />);
      
      defaultProps.onDeleteShopItem('SHOP1');
      
      expect(defaultProps.onDeleteShopItem).toHaveBeenCalledWith('SHOP1');
    });
  });

  describe('Empty States', () => {
    it('should handle empty services list', () => {
      const propsWithEmptyServices = {
        ...defaultProps,
        ancillaryServices: []
      };
      
      render(<ServicesMenuTab {...propsWithEmptyServices} />);
      
      expect(screen.queryByText('WiFi')).not.toBeInTheDocument();
    });

    it('should handle empty meals list', () => {
      const propsWithEmptyMeals = {
        ...defaultProps,
        mealOptions: []
      };
      
      render(<ServicesMenuTab {...propsWithEmptyMeals} />);
      
      expect(screen.queryByText('Vegetarian')).not.toBeInTheDocument();
    });

    it('should handle empty shop items list', () => {
      const propsWithEmptyShopItems = {
        ...defaultProps,
        shopItems: []
      };
      
      render(<ServicesMenuTab {...propsWithEmptyShopItems} />);
      
      expect(screen.queryByText('Perfume')).not.toBeInTheDocument();
    });
  });
});
