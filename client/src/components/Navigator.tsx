import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { RootState } from '../store/store';
import { useDispatch } from 'react-redux';
import { reset } from '../store/slices/navigatorSlice';

export default function Navigator(): React.ReactNode {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const navigationPath = useSelector((state: RootState) => state.navigator.path);

  useEffect(() => {
    if (navigationPath) {
      navigate(navigationPath);
      dispatch(reset());
    }
  }, [navigationPath]);

  return <></>;
}
