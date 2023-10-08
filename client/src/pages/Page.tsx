import React, { useEffect } from 'react';
import AuthenticatedPage from './AuthenticatedPage';
import UnauthenticatedPage from './UnauthenticatedPage';
import { useDispatch } from 'react-redux';
import { highlight } from '../store/slices/sideBarSlice';

interface PageProps {
  readonly component: React.ReactNode;
  readonly componentName?: 'Dashboard' | 'Finanzen' | 'Einstellungen';
  readonly protected?: boolean;
}

export default function Page(props: PageProps): React.ReactNode {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(highlight(props.componentName));
  }, [props.componentName]);

  if (!props.protected) {
    return <UnauthenticatedPage>{props.component}</UnauthenticatedPage>;
  }

  return <AuthenticatedPage>{props.component}</AuthenticatedPage>;
}
