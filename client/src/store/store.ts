import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import navigatorReducer from './slices/navigatorSlice';
import globalProgressIndicatorReducer from './slices/globalProgressIndicatorSlice';
import sideBarReducer from './slices/sideBarSlice';
import snackBarReducer from './slices/snackBarSlice';
import registrationReducer from './slices/registrationSlice';
import loginReducer from './slices/loginSlice';
import accountManagementReducer from './slices/accountManagementSlice';
import rootSaga from '../sagas/rootSaga';

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: {
    navigator: navigatorReducer,
    globalProgressIndicator: globalProgressIndicatorReducer,
    sideBar: sideBarReducer,
    snackBar: snackBarReducer,
    registration: registrationReducer,
    login: loginReducer,
    accountManagement: accountManagementReducer
  },
  middleware(getDefaultMiddleware) {
    return [...getDefaultMiddleware(), sagaMiddleware];
  }
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export default store;
