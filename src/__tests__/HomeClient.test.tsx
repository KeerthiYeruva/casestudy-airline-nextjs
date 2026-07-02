import React from 'react';
import { render, screen } from '@testing-library/react';
import HomeClient from '../shared/components/layout/HomeClient';
import useAuthStore from '../stores/useAuthStore';
import { UserRole } from '../domain/auth/types';

jest.mock('../stores/useAuthStore');
jest.mock('../features/auth/components/Auth', () => function MockAuth() {
  return <div>Auth Controls</div>;
});
jest.mock('../shared/components/common/LocaleSelector', () => function MockLocaleSelector() {
  return <div>Locale Selector</div>;
});
jest.mock('../features/customer/components/FlightSearch', () => function MockFlightSearch() {
  return <div>Flight Search View</div>;
});
jest.mock('../features/customer/components/PassengerPortal', () => function MockPassengerPortal() {
  return <div>Passenger Portal View</div>;
});
jest.mock('../features/customer/components/FlightStatusDashboard', () => function MockFlightStatusDashboard() {
  return <div>Flight Status View</div>;
});
jest.mock('../features/check-in/components/StaffCheckIn', () => function MockStaffCheckIn() {
  return <div>Staff Check-In View</div>;
});
jest.mock('../features/cabin/components/InFlight', () => function MockInFlight() {
  return <div>In-Flight View</div>;
});
jest.mock('../features/admin/components/AdminDashboard', () => function MockAdminDashboard() {
  return <div>Admin Dashboard View</div>;
});

const mockedUseAuthStore = useAuthStore as unknown as jest.Mock & { getState: jest.Mock };

describe('HomeClient navigation', () => {
  const setGuestAuth = () => {
    const authState = {
      user: null,
      isAuthenticated: false,
      role: null,
      setRole: jest.fn(),
    };

    mockedUseAuthStore.mockReturnValue(authState);
    mockedUseAuthStore.getState = jest.fn(() => authState);
  };

  const setAuthRole = (role: UserRole) => {
    const authState = {
      user: { displayName: 'Test User', email: 'test@example.com' },
      isAuthenticated: true,
      role,
      setRole: jest.fn(),
    };

    mockedUseAuthStore.mockReturnValue(authState);
    mockedUseAuthStore.getState = jest.fn(() => authState);
  };

  beforeEach(() => {
    setAuthRole(UserRole.ADMIN);
  });

  it('shows My Trips in the guest customer navbar', async () => {
    setGuestAuth();

    render(<HomeClient />);

    expect(screen.getByRole('button', { name: /navigate to flight search/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /navigate to my trips/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /navigate to flight status/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(await screen.findByText('Flight Search View')).toBeInTheDocument();
  });

  it('hides My Trips for authenticated admin users', async () => {
    render(<HomeClient />);

    expect(screen.queryByText('My Trips')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /navigate to flight search/i })).not.toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /navigate to admin dashboard/i })).toBeInTheDocument();
    expect(await screen.findByText('Admin Dashboard View')).toBeInTheDocument();
  });

  it('shows check-in navigation without customer trips for check-in agents', async () => {
    setAuthRole(UserRole.CHECKIN_AGENT);

    render(<HomeClient />);

    expect(screen.queryByText('My Trips')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /navigate to flight search/i })).not.toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /navigate to check-in/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /navigate to flight status/i })).toBeInTheDocument();
    expect(await screen.findByText('Staff Check-In View')).toBeInTheDocument();
  });

  it('shows in-flight navigation without customer trips for cabin crew', async () => {
    setAuthRole(UserRole.CABIN_CREW);

    render(<HomeClient />);

    expect(screen.queryByText('My Trips')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /navigate to flight search/i })).not.toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /navigate to in-flight services/i })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /navigate to flight status/i })).toBeInTheDocument();
    expect(await screen.findByText('In-Flight View')).toBeInTheDocument();
  });
});