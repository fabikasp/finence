import { configureStore } from '@reduxjs/toolkit';
import sideBarReducer from './sideBarSlice';
import loginReducer from './loginSlice';
import createSagaMiddleware from 'redux-saga';
import rootSaga from '../sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    sideBar: sideBarReducer,
    login: loginReducer
  },
  middleware(getDefaultMiddleware) {
    return [...getDefaultMiddleware(), sagaMiddleware];
  }
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export default store;
