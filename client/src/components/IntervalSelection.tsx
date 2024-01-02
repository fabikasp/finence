import React, { useState, useMemo, useCallback } from 'react';
import { Box, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, IconButton, Zoom } from '@mui/material';
import SwapVerticalCircleOutlinedIcon from '@mui/icons-material/SwapVerticalCircleOutlined';
import { styled } from '@mui/material/styles';
import moment, { Moment } from 'moment';
import 'moment/locale/de';
import DatePicker from './DatePicker';

const YEAR_LABEL = 'Jahr';
const MONTH_LABEL = 'Monat';
const DAY_LABEL = 'Tag';

const StyledDatePicker = styled(DatePicker)(({ theme }) => ({
  margin: '20px 0px 10px',
  [theme.breakpoints.up('md')]: {
    width: '30%'
  }
}));

const StyledFormControl = styled(FormControl)(() => ({
  margin: '20px 0px 10px'
}));

const StyledIconButton = styled(IconButton)(() => ({
  margin: '5px 10px 0px'
}));

export default function IntervalSelection(): React.ReactNode {
  moment.locale('de');
  const fiftyYearsAgo = useMemo(() => moment().subtract(50, 'year'), []);
  const inFiftyYears = useMemo(() => moment().add(50, 'year'), []);

  const years = useMemo(
    () => Array.from({ length: 101 }, (_, i) => (inFiftyYears.toDate().getFullYear() - i).toString()),
    [inFiftyYears]
  );
  const months = useMemo(() => moment.monthsShort(), []);
  const days = useCallback((year: string, monthName: string) => {
    const countDays = moment(year + '-' + moment().month(monthName).format('M'), 'YYYY-MM').daysInMonth();

    return Array.from({ length: countDays }, (_, i) => (++i).toString());
  }, []);

  const [customIntervalEnabled, setCustomIntervalEnabled] = useState(false);
  const [year, setYear] = useState<string>(years[Math.round((years.length - 1) / 2)]);
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');
  const [startDate, setStartDate] = useState<Moment | null>(moment());
  const [endDate, setEndDate] = useState<Moment | null>(null);

  const onSwap = useCallback(() => setCustomIntervalEnabled((state) => !state), []);

  const onYearChange = useCallback(
    (event: SelectChangeEvent) => {
      if (day !== '') {
        setDay('');
      }

      setYear(event.target.value);
    },
    [day]
  );

  const onMonthChange = useCallback(
    (event: SelectChangeEvent) => {
      if (day !== '') {
        setDay('');
      }

      setMonth(event.target.value);
    },
    [day]
  );

  const onDayChange = useCallback((event: SelectChangeEvent) => setDay(event.target.value), []);

  const onStartDateChange = useCallback(
    (value: Moment | null) => {
      if (value !== null && endDate !== null && moment(value).isAfter(endDate)) {
        setEndDate(null);
      }

      setStartDate(value);
    },
    [endDate]
  );

  const onEndDateChange = useCallback(
    (value: Moment | null) => {
      if (value !== null && startDate !== null && moment(value).isBefore(startDate)) {
        setStartDate(null);
      }

      setEndDate(value);
    },
    [startDate]
  );

  return (
    <Box display="flex">
      <StyledIconButton color="primary" onClick={onSwap}>
        <SwapVerticalCircleOutlinedIcon />
      </StyledIconButton>
      {!customIntervalEnabled && (
        <Zoom in style={{ transitionDelay: '0ms' }}>
          <Box>
            <StyledFormControl sx={{ minWidth: 80 }} size="small">
              <InputLabel id="year-label">{YEAR_LABEL}</InputLabel>
              <Select
                labelId="year-label"
                value={year}
                onChange={onYearChange}
                label={YEAR_LABEL}
                autoWidth
                sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              >
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
            <StyledFormControl sx={{ minWidth: 90 }} size="small">
              <InputLabel id="month-label">{MONTH_LABEL}</InputLabel>
              <Select
                labelId="month-label"
                value={month}
                onChange={onMonthChange}
                label={MONTH_LABEL}
                autoWidth
                sx={{ borderRadius: 0 }}
              >
                <MenuItem value="">Leer</MenuItem>
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
            <StyledFormControl sx={{ minWidth: 70 }} size="small">
              <InputLabel id="day-label">{DAY_LABEL}</InputLabel>
              <Select
                labelId="day-label"
                value={day}
                onChange={onDayChange}
                label={DAY_LABEL}
                autoWidth
                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                <MenuItem value="">Leer</MenuItem>
                {month !== '' &&
                  days(year, month).map((day) => (
                    <MenuItem key={day} value={day}>
                      {day}
                    </MenuItem>
                  ))}
              </Select>
            </StyledFormControl>
          </Box>
        </Zoom>
      )}
      {customIntervalEnabled && (
        <Zoom in style={{ transitionDelay: '0ms' }}>
          <Box>
            <StyledDatePicker
              label="Von"
              value={startDate}
              minDate={fiftyYearsAgo}
              maxDate={inFiftyYears}
              size="small"
              onChange={onStartDateChange}
              sx={{ '& .MuiInputBase-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 } }}
            />
            <StyledDatePicker
              label="Bis"
              value={endDate}
              minDate={fiftyYearsAgo}
              maxDate={inFiftyYears}
              size="small"
              onChange={onEndDateChange}
              sx={{ '& .MuiInputBase-root': { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } }}
            />
          </Box>
        </Zoom>
      )}
    </Box>
  );
}
