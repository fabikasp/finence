import { configureStore } from '@reduxjs/toolkit';
import firebaseReducer from './firebaseSlice';

const store = configureStore({
  reducer: {
    firebase: firebaseReducer
  }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
