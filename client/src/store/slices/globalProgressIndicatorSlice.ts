import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface ProgressIndicator {
  readonly open: boolean;
}

const initialState: ProgressIndicator = {
  open: false
};

const progressIndicatorSlice = createSlice({
  name: 'progressIndicator',
  initialState,
  reducers: {
    set: (_: ProgressIndicator, action: PayloadAction<boolean>) => ({
      open: action.payload
    })
  }
});

export const { set } = progressIndicatorSlice.actions;
export default progressIndicatorSlice.reducer;
