import { configureStore } from '@reduxjs/toolkit';
import employeeReducer from './slices/employeeSlice';
// Import slices here as you create them

export const store = configureStore({
  reducer: {
    employee: employeeReducer,
    // Add reducers here
  },
}); 