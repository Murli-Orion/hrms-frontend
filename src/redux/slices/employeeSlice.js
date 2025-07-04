import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  employees: [],
  status: 'idle',
};

const employeeSlice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    setEmployees(state, action) {
      state.employees = action.payload;
    },
    addEmployee(state, action) {
      state.employees.push(action.payload);
    },
  },
});

export const { setEmployees, addEmployee } = employeeSlice.actions;
export default employeeSlice.reducer; 