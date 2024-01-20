import { useTheme } from '@mui/material/styles';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RootState } from '../store/store';
import { dateLiesInInterval } from '../utils/helper';

type AbsoluteChartData = {
  category: string;
  absoluteValue: number;
};

export default function PieChart(): React.ReactNode {
  const { customIntervalEnabled, nativeInterval, customInterval } = useSelector(
    (state: RootState) => state.intervalSelection
  );
  const { bookings } = useSelector((state: RootState) => state.finances);
  const { showIncomes } = useSelector((state: RootState) => state.dashboard);

  const chartData = useMemo(() => {
    const filteredBookings = bookings
      .filter((booking) => (showIncomes ? booking.isIncome : !booking.isIncome))
      .filter((booking) => dateLiesInInterval(booking.date, customIntervalEnabled, nativeInterval, customInterval));

    const absoluteChartData = filteredBookings.reduce((acc: AbsoluteChartData[], curr) => {
      const entryIndex = acc.findIndex((entry) => entry.category === curr.category);

      if (entryIndex !== -1) {
        acc[entryIndex] = {
          ...acc[entryIndex],
          absoluteValue: acc[entryIndex].absoluteValue + curr.amount
        };
      } else {
        acc.push({ category: curr.category, absoluteValue: curr.amount });
      }

      return acc;
    }, []);

    const absoluteValueSum = absoluteChartData.reduce((acc, curr) => acc + curr.absoluteValue, 0);

    return absoluteChartData.map((entry) => ({
      ...entry,
      relativeValue: +((entry.absoluteValue / absoluteValueSum) * 100).toFixed(1)
    }));
  }, [bookings, showIncomes, customIntervalEnabled, nativeInterval, customInterval]);

  const theme = useTheme();
  const colors = useMemo(
    () => [theme.palette.primary.main, theme.palette.secondary.main, '#5879AD', '#A1A1A1'],
    [theme.palette.primary.main, theme.palette.secondary.main]
  );

  return (
    <ResponsiveContainer height={320}>
      <RechartsPieChart>
        <Pie
          data={chartData}
          dataKey="relativeValue"
          cx="50%"
          cy="50%"
          outerRadius="80%"
          label={(entry) => `${entry.category}: ${entry.absoluteValue} € (${entry.relativeValue} %)`}
        >
          {chartData.map((_, index) => (
            <Cell key={index} fill={colors[index % colors.length]} />
          ))}
        </Pie>
      </RechartsPieChart>
    </ResponsiveContainer>
  );
}
