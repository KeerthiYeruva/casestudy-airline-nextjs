import { createSlice } from '@reduxjs/toolkit';

// CheckIn slice now only handles view-specific state (selected flight and filters)
// All data is now managed in the shared dataSlice
const initialState = {
  selectedFlight: null,
  filterOptions: {
    checkedIn: null, // null = all, true = checked in, false = not checked in
    wheelchair: false,
    infant: false,
  },
};

const checkInSlice = createSlice({
  name: 'checkIn',
  initialState,
  reducers: {
    selectFlight(state, action) {
      state.selectedFlight = action.payload;
    },
    setFilter(state, action) {
      state.filterOptions = { ...state.filterOptions, ...action.payload };
    },
    clearFilters(state) {
      state.filterOptions = {
        checkedIn: null,
        wheelchair: false,
        infant: false,
      };
    },
  },
});

export const { 
  selectFlight, 
  setFilter,
  clearFilters,
} = checkInSlice.actions;

export default checkInSlice.reducer;
