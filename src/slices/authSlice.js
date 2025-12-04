import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// ========================================
// FIREBASE AUTHENTICATION (COMMENTED OUT)
// Uncomment these imports when you have Firebase configured
// ========================================
// import { signInWithPopup, signOut } from 'firebase/auth';
// import { auth, googleProvider } from '../firebaseConfig';

// ========================================
// FIREBASE ASYNC THUNKS (COMMENTED OUT)
// Uncomment these when using Firebase
// ========================================
// export const loginWithGoogle = createAsyncThunk(
//   'auth/loginWithGoogle',
//   async (_, { rejectWithValue }) => {
//     try {
//       const result = await signInWithPopup(auth, googleProvider);
//       return {
//         displayName: result.user.displayName,
//         email: result.user.email,
//         photoURL: result.user.photoURL,
//         uid: result.user.uid,
//       };
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );
//
// export const logoutUser = createAsyncThunk(
//   'auth/logoutUser',
//   async (_, { rejectWithValue }) => {
//     try {
//       await signOut(auth);
//       return null;
//     } catch (error) {
//       return rejectWithValue(error.message);
//     }
//   }
// );

// ========================================
// MOCK AUTHENTICATION (ACTIVE)
// Comment out these when using Firebase
// ========================================
// Mock async thunk for login (simulates API call)
export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async (userData, { rejectWithValue }) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      return userData;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Mock async thunk for logout
export const logoutUser = createAsyncThunk(
  'auth/logoutUser',
  async (_, { rejectWithValue }) => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      return null;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  role: null, // 'admin' or 'staff'
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginStart(state) {
      state.loading = true;
      state.error = null;
    },
    loginSuccess(state, action) {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
      state.role = action.payload.role || 'staff';
      state.error = null;
    },
    loginFailure(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.role = null;
      state.error = null;
      state.loading = false;
    },
    setUser(state, action) {
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
    },
    setRole(state, action) {
      state.role = action.payload;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Handle loginWithGoogle async thunk
    builder
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Authentication failed';
        state.isAuthenticated = false;
      })
      // Handle logoutUser async thunk
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.role = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Logout failed';
      });
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  logout,
  setUser,
  setRole,
  clearError,
} = authSlice.actions;

export default authSlice.reducer;