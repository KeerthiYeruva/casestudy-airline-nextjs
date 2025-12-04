import React from 'react';
import { render, screen } from '@testing-library/react';
import Auth from '../components/Auth';
import useAuthStore from '../stores/useAuthStore';

// Mock Firebase auth
jest.mock('../lib/firebaseConfig', () => ({
  auth: {},
  googleProvider: {}
}));

jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    callback(null);
    return jest.fn();
  })
}));

// Mock Zustand store
jest.mock('../stores/useAuthStore');

describe('Auth Component', () => {
  beforeEach(() => {
    useAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      role: null,
      loading: false,
      error: null,
      loginStart: jest.fn(),
      loginSuccess: jest.fn(),
      logout: jest.fn(),
      setRole: jest.fn(),
    });
  });

  test('renders login screen when not authenticated', () => {
    render(<Auth />);

    expect(screen.getByText(/Airline Management System/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in with Google/i })).toBeInTheDocument();
  });

  test('login button displays correct text', () => {
    render(<Auth />);

    const loginButton = screen.getByRole('button', { name: /Sign in with Google/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).not.toBeDisabled();
  });

  test('displays user profile when authenticated', () => {
    useAuthStore.mockReturnValue({
      user: {
        displayName: 'John Doe',
        email: 'john@example.com',
        photoURL: 'https://example.com/photo.jpg'
      },
      isAuthenticated: true,
      role: 'staff',
      loading: false,
      error: null,
      loginStart: jest.fn(),
      loginSuccess: jest.fn(),
      logout: jest.fn(),
      setRole: jest.fn(),
    });

    render(<Auth />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  test('role chip displays correct role for admin', () => {
    useAuthStore.mockReturnValue({
      user: {
        displayName: 'Admin User',
        email: 'admin@example.com'
      },
      isAuthenticated: true,
      role: 'admin',
      loading: false,
      error: null,
      loginStart: jest.fn(),
      loginSuccess: jest.fn(),
      logout: jest.fn(),
      setRole: jest.fn(),
    });

    render(<Auth />);

    expect(screen.getByText('Administrator')).toBeInTheDocument();
  });

  test('role chip displays correct role for staff', () => {
    useAuthStore.mockReturnValue({
      user: {
        displayName: 'Staff User',
        email: 'staff@example.com'
      },
      isAuthenticated: true,
      role: 'staff',
      loading: false,
      error: null,
      loginStart: jest.fn(),
      loginSuccess: jest.fn(),
      logout: jest.fn(),
      setRole: jest.fn(),
    });

    render(<Auth />);

    // Check for the Staff chip (it appears twice - in chip and select, so use getAllByText)
    const staffElements = screen.getAllByText('Staff');
    expect(staffElements.length).toBeGreaterThan(0);
    expect(staffElements[0]).toBeInTheDocument();
  });

  test('role select dropdown is present when authenticated', () => {
    useAuthStore.mockReturnValue({
      user: {
        displayName: 'Staff User',
        email: 'staff@example.com'
      },
      isAuthenticated: true,
      role: 'staff',
      loading: false,
      error: null,
      loginStart: jest.fn(),
      loginSuccess: jest.fn(),
      logout: jest.fn(),
      setRole: jest.fn(),
    });

    render(<Auth />);

    // The select element is accessible by role combobox
    const roleSelect = screen.getByRole('combobox');
    expect(roleSelect).toBeInTheDocument();
    expect(roleSelect).toHaveTextContent('Staff');
  });

  test('displays loading state with disabled button', () => {
    useAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      role: null,
      loading: true,
      error: null,
      loginStart: jest.fn(),
      loginSuccess: jest.fn(),
      logout: jest.fn(),
      setRole: jest.fn(),
    });

    render(<Auth />);

    const loginButton = screen.getByRole('button', { name: /Signing in.../i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toBeDisabled();
  });

  test('displays error message when login fails', () => {
    useAuthStore.mockReturnValue({
      user: null,
      isAuthenticated: false,
      role: null,
      loading: false,
      error: 'Authentication failed. Please try again.',
      loginStart: jest.fn(),
      loginSuccess: jest.fn(),
      logout: jest.fn(),
      setRole: jest.fn(),
    });

    render(<Auth />);

    expect(screen.getByText(/Authentication failed. Please try again./i)).toBeInTheDocument();
  });

  test('logout button has aria-label for accessibility', () => {
    useAuthStore.mockReturnValue({
      user: {
        displayName: 'Test User',
        email: 'test@example.com'
      },
      isAuthenticated: true,
      role: 'staff',
      loading: false,
      error: null,
      loginStart: jest.fn(),
      loginSuccess: jest.fn(),
      logout: jest.fn(),
      setRole: jest.fn(),
    });

    render(<Auth />);

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    expect(logoutButton).toHaveAttribute('aria-label', 'Logout');
  });
});
