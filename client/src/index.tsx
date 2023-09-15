import React from 'react';
import ReactDOM from 'react-dom/client';
import store from './store/store';
import { Provider } from 'react-redux';
import { assertNonNullable } from './utils/assert';
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import AuthenticatedPage from './pages/AuthenticatedPage';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme/theme';
import LoginPage from './pages/LoginPage';

const rootElement = document.getElementById('root');
assertNonNullable(rootElement);

ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <LoginPage />
        {false && (
          <AuthenticatedPage>
            <Routes>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<div>Dashboard</div>} />
              <Route path="finanzen" element={<div>Finanzen</div>} />
              <Route path="konto" element={<div>Konto</div>} />
            </Routes>
          </AuthenticatedPage>
        )}
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
