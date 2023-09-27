import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import navigatorReducer from './slices/navigatorSlice';
import sideBarReducer from './slices/sideBarSlice';
import snackBarReducer from './slices/snackBarSlice';
import loginReducer from './slices/loginSlice';
import rootSaga from '../sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    navigator: navigatorReducer,
    sideBar: sideBarReducer,
    snackBar: snackBarReducer,
    login: loginReducer
  },
  middleware(getDefaultMiddleware) {
    return [...getDefaultMiddleware(), sagaMiddleware];
  }
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export default store;
