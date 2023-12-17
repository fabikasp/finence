import React, { useState, useCallback } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { styled } from '@mui/material/styles';
import BookingsTable from './BookingsTable';

const TOTAL_TAB = 'total';
const INCOME_TAB = 'income';
const EXPENSES_TAB = 'expenses';

const StyledBox = styled(Box)(() => ({
  backgroundColor: '#232F3B',
  padding: '15px 20px 20px'
}));

export default function Finances(): React.ReactNode {
  const [tab, setTab] = useState(TOTAL_TAB);

  const onTabChange = useCallback((_: React.SyntheticEvent, newTab: string) => setTab(newTab), []);

  return (
    <StyledBox display="flex" flexDirection="column">
      <Box sx={{ borderBottom: 1, borderColor: '#000000', marginBottom: 2 }}>
        <Tabs value={tab} onChange={onTabChange}>
          <Tab value={TOTAL_TAB} label="Gesamt" />
          <Tab value={INCOME_TAB} label="Einnahmen" />
          <Tab value={EXPENSES_TAB} label="Ausgaben" />
        </Tabs>
      </Box>
      <BookingsTable />
    </StyledBox>
  );
}
