import React, { useCallback } from 'react';
import { Box, Tabs, Tab as MuiTab } from '@mui/material';
import { styled } from '@mui/material/styles';
import BookingsTable from './BookingsTable';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store/store';
import { Tab, setTab } from '../store/slices/financesSlice';

const StyledBox = styled(Box)(() => ({
  backgroundColor: '#232F3B',
  padding: '15px 20px 20px'
}));

export default function Finances(): React.ReactNode {
  const dispatch = useDispatch();
  const { tab } = useSelector((state: RootState) => state.finances);

  const onTabChange = useCallback((_: React.SyntheticEvent, newTab: Tab) => dispatch(setTab(newTab)), [dispatch]);

  return (
    <StyledBox display="flex" flexDirection="column">
      <Box sx={{ borderBottom: 1, borderColor: '#000000', marginBottom: 2 }}>
        <Tabs value={tab} onChange={onTabChange}>
          <MuiTab value={Tab.TOTAL} label="Gesamt" />
          <MuiTab value={Tab.INCOME} label="Einnahmen" />
          <MuiTab value={Tab.EXPENSES} label="Ausgaben" />
        </Tabs>
      </Box>
      <BookingsTable />
    </StyledBox>
  );
}
