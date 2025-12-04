// src/slices/adminSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Admin slice now only handles view-specific state (selected flight and filters)
// All data is now managed in the shared dataSlice
const initialState = {
  selectedFlight: null,
  filterOptions: {
    missingPassport: false,
    missingAddress: false,
    missingDOB: false,
  },
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    selectFlight(state, action) {
      state.selectedFlight = action.payload;
    },
    setAdminFilter(state, action) {
      state.filterOptions = { ...state.filterOptions, ...action.payload };
    },
    clearAdminFilters(state) {
      state.filterOptions = {
        missingPassport: false,
        missingAddress: false,
        missingDOB: false,
      };
    },
  },
});

export const { 
  selectFlight, 
  setAdminFilter,
  clearAdminFilters
} = adminSlice.actions;

export default adminSlice.reducer;