import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './store/store';
import { Provider } from 'react-redux';
import { assertNonNullable } from './utils/assert';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme/theme';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Page from './pages/Page';
import { ACCOUNT_ROUTE, DASHBOARD_ROUTE, FINANCES_ROUTE, LOGIN_ROUTE, REGISTRATION_ROUTE } from './utils/const';
import dotenv from 'dotenv';

dotenv.config();

const rootElement = document.getElementById('root');
assertNonNullable(rootElement);

ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to={`/${DASHBOARD_ROUTE}`} replace />} />
          <Route path={DASHBOARD_ROUTE} element={<Page child={<div>Dashboard</div>} protected />} />
          <Route path={FINANCES_ROUTE} element={<Page child={<div>Finanzen</div>} protected />} />
          <Route path={ACCOUNT_ROUTE} element={<Page child={<div>Konto</div>} protected />} />
          <Route path={REGISTRATION_ROUTE} element={<Page child={<RegistrationForm />} />} />
          <Route path={LOGIN_ROUTE} element={<Page child={<LoginForm />} />} />
          <Route path="*" element={<Navigate to={`/${DASHBOARD_ROUTE}`} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
