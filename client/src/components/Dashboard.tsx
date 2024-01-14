import React, { useEffect } from 'react';
import IntervalSelection from './IntervalSelection';
import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import PieChart from './PieChart';
import { useDispatch } from 'react-redux';
import { loadBookings } from '../store/actions';

const StyledBox = styled(Box)(() => ({
  backgroundColor: '#232F3B',
  padding: '15px 20px 20px'
}));

export default function Dashboard(): React.ReactNode {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(loadBookings());
  }, [dispatch]);

  return (
    <StyledBox>
      <IntervalSelection />
      <PieChart />
    </StyledBox>
  );
}
