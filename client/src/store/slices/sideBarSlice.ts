import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface SideBar {
  readonly open: boolean;
  readonly highlighted?: 'Dashboard' | 'Finanzen' | 'Kategorien' | 'Einstellungen';
}

const initialState: SideBar = {
  open: false,
  highlighted: undefined
};

const sideBarSlice = createSlice({
  name: 'sideBar',
  initialState,
  reducers: {
    toggle: (state: SideBar) => ({ ...state, open: !state.open }),
    highlight: (
      state: SideBar,
      action: PayloadAction<'Dashboard' | 'Finanzen' | 'Kategorien' | 'Einstellungen' | undefined>
    ) => ({
      ...state,
      highlighted: action.payload
    })
  }
});

export const { toggle, highlight } = sideBarSlice.actions;
export default sideBarSlice.reducer;
