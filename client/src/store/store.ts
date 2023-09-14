import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import sideBarReducer from './sideBarSlice';

const sagaMiddleware = createSagaMiddleware();
const store = configureStore({
  reducer: {
    sideBar: sideBarReducer
  },
  middleware(getDefaultMiddleware) {
    return [...getDefaultMiddleware(), sagaMiddleware];
  }
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
