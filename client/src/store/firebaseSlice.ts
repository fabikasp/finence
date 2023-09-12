import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { FirebaseApp } from 'firebase/app';

type Firebase = {
  app: FirebaseApp | undefined;
};

const initialState: Firebase = {
  app: undefined
};

const firebaseSlice = createSlice({
  name: 'firebase',
  initialState: initialState,
  reducers: {
    setFirebase: (state, action: PayloadAction<FirebaseApp>) => {
      state.app = action.payload;
    }
  }
});

export const { setFirebase } = firebaseSlice.actions;
export default firebaseSlice.reducer;
