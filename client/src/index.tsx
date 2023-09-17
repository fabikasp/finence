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
import { ACCOUNT_ROUTE, DASHBOARD_ROUTE, FINANCES_ROUTE, LOGIN_ROUTE } from './utils/const';

interface ProtectedComponentProps {
  child: React.ReactNode;
}

const ProtectedComponent = (props: ProtectedComponentProps): React.ReactNode => {
  // TODO: Tutorial für Auth ansehen, ggf. Sicherheit hier verschärfen

  const loggedIn = true;

  if (!loggedIn) {
    return <Navigate to="/login" replace />;
  }

  return <AuthenticatedPage>{props.child}</AuthenticatedPage>;
};

const rootElement = document.getElementById('root');
assertNonNullable(rootElement);

ReactDOM.createRoot(rootElement).render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route index element={<Navigate to={`/${DASHBOARD_ROUTE}`} replace />} />
          <Route path={DASHBOARD_ROUTE} element={<ProtectedComponent child={<div>Dashboard</div>} />} />
          <Route path={FINANCES_ROUTE} element={<ProtectedComponent child={<div>Finanzen</div>} />} />
          <Route path={ACCOUNT_ROUTE} element={<ProtectedComponent child={<div>Konto</div>} />} />
          <Route path={LOGIN_ROUTE} element={<LoginPage />} />
          <Route path="*" element={<Navigate to={`/${DASHBOARD_ROUTE}`} replace />} />
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);
