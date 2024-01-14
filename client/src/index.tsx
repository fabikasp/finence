import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './store/store';
import { Provider } from 'react-redux';
import { assertNonNullable } from './utils/assert';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme/theme';
import Login from './components/Login';
import Registration from './components/Registration';
import Page from './pages/Page';
import {
  CATEGORIES,
  CATEGORIES_ROUTE,
  DASHBOARD,
  DASHBOARD_ROUTE,
  FINANCES,
  FINANCES_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE,
  SETTINGS,
  SETTINGS_ROUTE
} from './utils/const';
import dotenv from 'dotenv';
import SnackBar from './components/SnackBar';
import Navigator from './components/Navigator';
import GlobalProgressIndicator from './components/GlobalProgressIndicator';
import Settings from './components/Settings';
import Finances from './components/Finances';
import Categories from './components/Categories';
import Dashboard from './components/Dashboard';

dotenv.config();

const rootElement = document.getElementById('root');
assertNonNullable(rootElement);

ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <GlobalProgressIndicator />
      <SnackBar />
      <BrowserRouter>
        <Navigator />
        <Routes>
          <Route index element={<Navigate to={`/${DASHBOARD_ROUTE}`} replace />} />
          <Route
            path={DASHBOARD_ROUTE}
            element={<Page component={<Dashboard />} componentName={DASHBOARD} protected />}
          />
          <Route path={FINANCES_ROUTE} element={<Page component={<Finances />} componentName={FINANCES} protected />} />
          <Route
            path={CATEGORIES_ROUTE}
            element={<Page component={<Categories />} componentName={CATEGORIES} protected />}
          />
          <Route path={SETTINGS_ROUTE} element={<Page component={<Settings />} componentName={SETTINGS} protected />} />
          <Route path={REGISTRATION_ROUTE} element={<Page component={<Registration />} />} />
          <Route path={LOGIN_ROUTE} element={<Page component={<Login />} />} />
          <Route path="*" element={<Navigate to={`/${DASHBOARD_ROUTE}`} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
