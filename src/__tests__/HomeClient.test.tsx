import React from 'react';
import { render, screen } from '@testing-library/react';
import HomeClient from '@/components/layout/HomeClient';
import useAuthStore from '@/stores/useAuthStore';
import { UserRole } from '@/types/auth';

jest.mock('@/stores/useAuthStore');
jest.mock('@/components/auth/Auth', () => function MockAuth() {
  return <div>Auth Controls</div>;
});
jest.mock('@/components/common/LocaleSelector', () => function MockLocaleSelector() {
  return <div>Locale Selector</div>;
});
jest.mock('@/components/customer/FlightSearch', () => function MockFlightSearch() {
  return <div>Flight Search View</div>;
});
jest.mock('@/components/customer/PassengerPortal', () => function MockPassengerPortal() {
  return <div>Passenger Portal View</div>;
});
jest.mock('@/components/customer/FlightStatusDashboard', () => function MockFlightStatusDashboard() {
  return <div>Flight Status View</div>;
});
jest.mock('@/components/checkin/StaffCheckIn', () => function MockStaffCheckIn() {
  return <div>Staff Check-In View</div>;
});
jest.mock('@/components/inflight/InFlight', () => function MockInFlight() {
  return <div>In-Flight View</div>;
});
jest.mock('@/components/admin/AdminDashboard', () => function MockAdminDashboard() {
  return <div>Admin Dashboard View</div>;
});

const mockedUseAuthStore = useAuthStore as unknown as jest.Mock & { getState: jest.Mock };

describe('HomeClient navigation', () => {
  beforeEach(() => {
    const authState = {
      user: { displayName: 'Admin User', email: 'admin@example.com' },
      isAuthenticated: true,
      role: UserRole.ADMIN,
      setRole: jest.fn(),
    };

    mockedUseAuthStore.mockReturnValue(authState);
    mockedUseAuthStore.getState = jest.fn(() => authState);
  });

  it('hides My Trips for authenticated admin users', async () => {
    render(<HomeClient />);

    expect(screen.queryByText('My Trips')).not.toBeInTheDocument();
    expect(await screen.findByRole('button', { name: /navigate to admin dashboard/i })).toBeInTheDocument();
  });
});