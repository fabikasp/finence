import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ToggleButtonGroup, ToggleButton } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';
import { RootState } from '../store/store';
import { dateLiesInInterval } from '../utils/helper';

interface StyledToggleButtonProps {
  buttonColor: string;
}

const StyledToggleButton = styled(ToggleButton, {
  shouldForwardProp: (prop) => prop !== 'buttonColor'
})<StyledToggleButtonProps>(({ buttonColor }) => ({
  '&.Mui-disabled': {
    border: `1px solid ${buttonColor}`,
    color: buttonColor
  },
  '&.Mui-selected': {
    backgroundColor: buttonColor,
    color: '#000000'
  }
}));

export default function Balance(): React.ReactNode {
  const { customIntervalEnabled, nativeInterval, customInterval } = useSelector(
    (state: RootState) => state.intervalSelection
  );
  const { bookings } = useSelector((state: RootState) => state.finances);

  const theme = useTheme();
  const incomeColor = useMemo(() => theme.palette.primary.main, [theme.palette.primary.main]);
  const expensesColor = useMemo(() => theme.palette.error.main, [theme.palette.error.main]);
  const neutralColor = useMemo(() => theme.palette.text.primary, [theme.palette.text.primary]);

  const [income, expenses, balance] = useMemo(() => {
    const filteredBookings = bookings.filter((booking) =>
      dateLiesInInterval(booking.date, customIntervalEnabled, nativeInterval, customInterval)
    );

    const result = filteredBookings.reduce(
      (acc, curr) => {
        acc[curr.isIncome ? 0 : 1] += curr.amount;
        return acc;
      },
      [0, 0]
    );

    result.push(result[0] - result[1]);
    return result;
  }, [bookings, customIntervalEnabled, nativeInterval, customInterval]);

  return (
    <>
      <ToggleButtonGroup value={true} disabled sx={{ marginRight: 2 }}>
        <StyledToggleButton buttonColor={incomeColor} value={true}>
          Einnahmen
        </StyledToggleButton>
        <StyledToggleButton buttonColor={incomeColor} value={false}>
          {income} €
        </StyledToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup value={true} disabled sx={{ marginRight: 2 }}>
        <StyledToggleButton buttonColor={expensesColor} value={true}>
          Ausgaben
        </StyledToggleButton>
        <StyledToggleButton buttonColor={expensesColor} value={false}>
          {expenses} €
        </StyledToggleButton>
      </ToggleButtonGroup>
      <ToggleButtonGroup value={true} disabled>
        <StyledToggleButton buttonColor={neutralColor} value={true}>
          Bilanz
        </StyledToggleButton>
        <StyledToggleButton buttonColor={neutralColor} value={false}>
          {balance} €
        </StyledToggleButton>
      </ToggleButtonGroup>
    </>
  );
}
