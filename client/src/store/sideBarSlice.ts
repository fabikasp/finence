import { createSlice } from '@reduxjs/toolkit';

interface SideBar {
  readonly open: boolean;
}

const initialState: SideBar = {
  open: false
};

const sideBarSlice = createSlice({
  name: 'sideBar',
  initialState,
  reducers: {
    toggle: (state: SideBar) => ({ open: !state.open })
  }
});

export const { toggle } = sideBarSlice.actions;
export default sideBarSlice.reducer;
