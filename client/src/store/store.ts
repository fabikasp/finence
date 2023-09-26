import { configureStore } from '@reduxjs/toolkit';
import sideBarReducer from './sideBarSlice';
import snackBarReducer from './snackBarSlice';
import { userApi } from '../queries/userQueries';

const store = configureStore({
  reducer: {
    sideBar: sideBarReducer,
    snackBar: snackBarReducer,
    [userApi.reducerPath]: userApi.reducer
  },
  middleware(getDefaultMiddleware) {
    return [...getDefaultMiddleware(), userApi.middleware];
  }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
