import { configureStore } from '@reduxjs/toolkit';
import dataReducer from './slices/dataSlice';
import checkInReducer from './slices/checkInSlice';
import adminReducer from './slices/adminSlice';
import authReducer from './slices/authSlice';
import toastReducer from './slices/toastSlice';

const store = configureStore({
  reducer: {
    data: dataReducer,
    checkIn: checkInReducer,
    admin: adminReducer,
    auth: authReducer,
    toast: toastReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these action types for Firebase user objects
        ignoredActions: [
          'auth/loginSuccess',
          'auth/setUser',
          'auth/loginWithGoogle/fulfilled',
          'auth/loginWithGoogle/pending',
        ],
        // Ignore these paths in the state
        ignoredPaths: ['auth.user'],
      },
    }),
});

export default store;