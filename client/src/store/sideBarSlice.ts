import { createSlice } from '@reduxjs/toolkit';

interface SideBar {
  open: boolean;
}

const initialState: SideBar = {
  open: false
};

const sideBarSlice = createSlice({
  name: 'sideBar',
  initialState: initialState,
  reducers: {
    toggle: (state) => {
      return { open: !state.open };
    }
  }
});

export const { toggle } = sideBarSlice.actions;
export default sideBarSlice.reducer;
