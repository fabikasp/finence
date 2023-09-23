import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthenticatedPage from './AuthenticatedPage';
import UnauthenticatedPage from './UnauthenticatedPage';
import { LOGIN_ROUTE } from '../utils/const';

interface PageProps {
  readonly child: React.ReactNode;
  readonly protected?: boolean;
}

export default function Page(props: PageProps): React.ReactNode {
  // TODO: Tutorial für Auth ansehen, ggf. Sicherheit hier verschärfen

  const loggedIn = true;

  if (props.protected && !loggedIn) {
    return <Navigate to={`/${LOGIN_ROUTE}`} replace />;
  }

  if (!props.protected) {
    return <UnauthenticatedPage>{props.child}</UnauthenticatedPage>;
  }

  return <AuthenticatedPage>{props.child}</AuthenticatedPage>;
}
