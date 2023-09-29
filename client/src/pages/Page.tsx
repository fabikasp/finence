import React from 'react';
import AuthenticatedPage from './AuthenticatedPage';
import UnauthenticatedPage from './UnauthenticatedPage';

interface PageProps {
  readonly child: React.ReactNode;
  readonly protected?: boolean;
}

export default function Page(props: PageProps): React.ReactNode {
  if (!props.protected) {
    return <UnauthenticatedPage>{props.child}</UnauthenticatedPage>;
  }

  return <AuthenticatedPage>{props.child}</AuthenticatedPage>;
}
