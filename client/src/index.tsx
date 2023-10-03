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
  ACCOUNT,
  ACCOUNT_ROUTE,
  DASHBOARD,
  DASHBOARD_ROUTE,
  FINANCES,
  FINANCES_ROUTE,
  LOGIN_ROUTE,
  REGISTRATION_ROUTE
} from './utils/const';
import dotenv from 'dotenv';
import SnackBar from './components/SnackBar';
import Navigator from './components/Navigator';
import GlobalProgressIndicator from './components/GlobalProgressIndicator';
import AccountManagement from './components/AccountManagement';

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
            element={<Page component={<div>Dashboard</div>} componentName={DASHBOARD} protected />}
          />
          <Route
            path={FINANCES_ROUTE}
            element={<Page component={<div>Finanzen</div>} componentName={FINANCES} protected />}
          />
          <Route
            path={ACCOUNT_ROUTE}
            element={<Page component={<AccountManagement />} componentName={ACCOUNT} protected />}
          />
          <Route path={REGISTRATION_ROUTE} element={<Page component={<Registration />} />} />
          <Route path={LOGIN_ROUTE} element={<Page component={<Login />} />} />
          <Route path="*" element={<Navigate to={`/${DASHBOARD_ROUTE}`} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
