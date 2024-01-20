import { createSlice } from '@reduxjs/toolkit';

interface Dashboard {
  readonly showIncomes: boolean;
}

const initialState: Dashboard = {
  showIncomes: true
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    toggleShowIncomes: (state: Dashboard) => ({ showIncomes: !state.showIncomes }),
    clear: () => initialState
  }
});

export const { toggleShowIncomes, clear } = dashboardSlice.actions;
export default dashboardSlice.reducer;
