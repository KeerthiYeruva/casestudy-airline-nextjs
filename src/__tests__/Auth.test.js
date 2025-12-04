import React from 'react';
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Auth from '../components/Auth';
import authReducer from '../slices/authSlice';

// Mock Firebase auth
jest.mock('../firebaseConfig', () => ({
  auth: {},
  googleProvider: {}
}));

jest.mock('firebase/auth', () => ({
  signInWithPopup: jest.fn(),
  signOut: jest.fn(),
  onAuthStateChanged: jest.fn((auth, callback) => {
    // Simulate no user initially
    callback(null);
    return jest.fn(); // Return unsubscribe function
  })
}));

describe('Auth Component', () => {
  let store;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['auth/loginSuccess', 'auth/setUser'],
            ignoredPaths: ['auth.user']
          }
        })
    });
  });

  test('renders login screen when not authenticated', () => {
    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );

    expect(screen.getByText(/Welcome to Airline Management System/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Sign in with Google/i })).toBeInTheDocument();
  });

  test('login button is accessible', () => {
    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );

    const loginButton = screen.getByRole('button', { name: /Sign in with Google/i });
    expect(loginButton).toBeInTheDocument();
    expect(loginButton).toHaveAttribute('aria-label');
  });

  test('displays user profile when authenticated', () => {
    // Pre-populate store with authenticated user
    store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: {
            displayName: 'John Doe',
            email: 'john@example.com',
            photoURL: 'https://example.com/photo.jpg'
          },
          isAuthenticated: true,
          role: 'staff',
          loading: false,
          error: null
        }
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['auth/loginSuccess', 'auth/setUser'],
            ignoredPaths: ['auth.user']
          }
        })
    });

    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Logout/i })).toBeInTheDocument();
  });

  test('role chip displays correct role', () => {
    store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: {
            displayName: 'Admin User',
            email: 'admin@example.com'
          },
          isAuthenticated: true,
          role: 'admin',
          loading: false,
          error: null
        }
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['auth/loginSuccess', 'auth/setUser'],
            ignoredPaths: ['auth.user']
          }
        })
    });

    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );

    expect(screen.getByText('Administrator')).toBeInTheDocument();
  });

  test('role dropdown is accessible', () => {
    store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: {
            displayName: 'Staff User',
            email: 'staff@example.com'
          },
          isAuthenticated: true,
          role: 'staff',
          loading: false,
          error: null
        }
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['auth/loginSuccess', 'auth/setUser'],
            ignoredPaths: ['auth.user']
          }
        })
    });

    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );

    const roleSelect = screen.getByLabelText(/Switch Role/i);
    expect(roleSelect).toBeInTheDocument();
  });

  test('logout button triggers logout action', () => {
    store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: {
            displayName: 'Test User',
            email: 'test@example.com'
          },
          isAuthenticated: true,
          role: 'staff',
          loading: false,
          error: null
        }
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['auth/loginSuccess', 'auth/setUser'],
            ignoredPaths: ['auth.user']
          }
        })
    });

    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );

    const logoutButton = screen.getByRole('button', { name: /Logout/i });
    fireEvent.click(logoutButton);

    // After logout, state should reflect logged out status
    const state = store.getState();
    expect(state.auth.isAuthenticated).toBe(false);
    expect(state.auth.user).toBe(null);
  });

  test('displays loading state', () => {
    store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          role: null,
          loading: true,
          error: null
        }
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['auth/loginSuccess', 'auth/setUser'],
            ignoredPaths: ['auth.user']
          }
        })
    });

    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('displays error message when login fails', () => {
    store = configureStore({
      reducer: {
        auth: authReducer
      },
      preloadedState: {
        auth: {
          user: null,
          isAuthenticated: false,
          role: null,
          loading: false,
          error: 'Authentication failed. Please try again.'
        }
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: {
            ignoredActions: ['auth/loginSuccess', 'auth/setUser'],
            ignoredPaths: ['auth.user']
          }
        })
    });

    render(
      <Provider store={store}>
        <Auth />
      </Provider>
    );

    expect(screen.getByText(/Authentication failed/i)).toBeInTheDocument();
  });
});
