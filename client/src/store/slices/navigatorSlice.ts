import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface Navigator {
  path: string | undefined;
}

const initialState: Navigator = {
  path: undefined
};

const navigatorSlice = createSlice({
  name: 'navigator',
  initialState,
  reducers: {
    navigate: (_: Navigator, action: PayloadAction<string>) => ({ path: action.payload }),
    reset: () => ({ path: undefined })
  }
});

export const { navigate, reset } = navigatorSlice.actions;
export default navigatorSlice.reducer;
