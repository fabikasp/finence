import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Box, Table, TableBody, TableCell, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';
import { RootState } from '../store/store';
import { dateLiesInInterval } from '../utils/helper';

const StyledBox = styled(Box)(({ theme }) => ({
  border: `1px solid ${theme.palette.text.primary}`,
  borderBottom: 0,
  borderRadius: theme.shape.borderRadius,
  [theme.breakpoints.up('md')]: {
    width: '35%'
  }
}));

export default function BalanceTable(): React.ReactNode {
  const { customIntervalEnabled, nativeInterval, customInterval } = useSelector(
    (state: RootState) => state.intervalSelection
  );
  const { bookings } = useSelector((state: RootState) => state.finances);

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
    <StyledBox>
      <Table size="small">
        <TableBody>
          <TableRow>
            <TableCell sx={{ width: '60%' }}>Einnahmen</TableCell>
            <TableCell sx={(theme) => ({ color: theme.palette.primary.main })}>{income} €</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Ausgaben</TableCell>
            <TableCell sx={(theme) => ({ color: theme.palette.error.main })}>{`${
              expenses > 0 ? '-' : ''
            }${expenses} €`}</TableCell>
          </TableRow>
          <TableRow>
            <TableCell>Bilanz</TableCell>
            <TableCell sx={(theme) => ({ color: theme.palette[balance < 0 ? 'error' : 'primary'].main })}>
              {balance} €
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </StyledBox>
  );
}
