import { useTheme } from '@mui/material/styles';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { PieChart as RechartsPieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { RootState } from '../store/store';
import { Box, Tab as MuiTab, Tabs } from '@mui/material';
import { dateLiesInInterval } from '../utils/helper';

enum Tab {
  INCOME = 'income',
  EXPENSES = 'expenses'
}

type AbsoluteChartData = {
  category: string;
  absoluteValue: number;
};

export default function PieChart(): React.ReactNode {
  const [tab, setTab] = useState(Tab.INCOME);
  const { customIntervalEnabled, nativeInterval, customInterval } = useSelector(
    (state: RootState) => state.intervalSelection
  );
  const { bookings } = useSelector((state: RootState) => state.finances);

  const onTabChange = useCallback((_: React.SyntheticEvent, newTab: Tab) => setTab(newTab), []);

  const chartData = useMemo(() => {
    const filteredBookings = bookings
      .filter((booking) => (tab === Tab.INCOME ? booking.isIncome : !booking.isIncome))
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
  }, [bookings, tab, customIntervalEnabled, nativeInterval, customInterval]);

  const theme = useTheme();
  const colors = useMemo(
    () => [theme.palette.primary.main, theme.palette.secondary.main, '#5879AD', '#A1A1A1'],
    [theme.palette.primary.main, theme.palette.secondary.main]
  );

  return (
    <>
      <Box sx={{ borderBottom: 1, borderColor: '#000000', marginBottom: 2 }}>
        <Tabs value={tab} onChange={onTabChange}>
          <MuiTab value={Tab.INCOME} label="Einnahmen" />
          <MuiTab value={Tab.EXPENSES} label="Ausgaben" />
        </Tabs>
      </Box>
      <ResponsiveContainer height={350}>
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
    </>
  );
}
