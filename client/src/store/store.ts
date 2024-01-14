import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import navigatorReducer from './slices/navigatorSlice';
import globalProgressIndicatorReducer from './slices/globalProgressIndicatorSlice';
import sideBarReducer from './slices/sideBarSlice';
import snackBarReducer from './slices/snackBarSlice';
import registrationReducer from './slices/registrationSlice';
import loginReducer from './slices/loginSlice';
import intervalSelectionReducer from './slices/intervalSelectionSlice';
import financesReducer from './slices/financesSlice';
import categoriesReducer from './slices/categoriesSlice';
import settingsReducer from './slices/settingsSlice';
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
    intervalSelection: intervalSelectionReducer,
    finances: financesReducer,
    categories: categoriesReducer,
    settings: settingsReducer
  },
  middleware(getDefaultMiddleware) {
    return [...getDefaultMiddleware(), sagaMiddleware];
  }
});

sagaMiddleware.run(rootSaga);

export type RootState = ReturnType<typeof store.getState>;
export default store;
