import React, { useMemo, useCallback } from 'react';
import { Box, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, IconButton, Zoom } from '@mui/material';
import SwapVerticalCircleOutlinedIcon from '@mui/icons-material/SwapVerticalCircleOutlined';
import { styled } from '@mui/material/styles';
import moment, { Moment } from 'moment';
import 'moment/locale/de';
import DatePicker from './DatePicker';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useDispatch } from 'react-redux';
import { setCustomInterval, setNativeInterval, toggleCustomIntervalEnabled } from '../store/slices/financesSlice';
import { convertMomentToUnix, convertUnixToMoment } from '../utils/helper';

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
  const dispatch = useDispatch();
  const { customIntervalEnabled, nativeInterval, customInterval } = useSelector((state: RootState) => state.finances);

  moment.locale('de');
  const fiftyYearsAgo = useMemo(() => moment().subtract(50, 'year'), []);
  const inFiftyYears = useMemo(() => moment().add(50, 'year'), []);

  const years = useMemo(
    () => Array.from({ length: 101 }, (_, i) => (inFiftyYears.toDate().getFullYear() - (101 - i)).toString()),
    [inFiftyYears]
  );
  const months = useMemo(() => moment.monthsShort(), []);
  const days = useCallback((year: string, monthName: string) => {
    const countDays = moment(year + '-' + moment().month(monthName).format('M'), 'YYYY-MM').daysInMonth();

    return Array.from({ length: countDays }, (_, i) => (++i).toString());
  }, []);

  const onSwap = useCallback(() => dispatch(toggleCustomIntervalEnabled()), [dispatch]);

  const onYearChange = useCallback(
    (event: SelectChangeEvent) => dispatch(setNativeInterval({ ...nativeInterval, year: event.target.value, day: '' })),
    [nativeInterval, dispatch]
  );

  const onMonthChange = useCallback(
    (event: SelectChangeEvent) =>
      dispatch(setNativeInterval({ ...nativeInterval, month: event.target.value, day: '' })),
    [nativeInterval, dispatch]
  );

  const onDayChange = useCallback(
    (event: SelectChangeEvent) => dispatch(setNativeInterval({ ...nativeInterval, day: event.target.value })),
    [nativeInterval, dispatch]
  );

  const onStartDateChange = useCallback(
    (value: Moment | null) => {
      const clearEndDate =
        value !== null && customInterval.endDate !== null && value.isAfter(convertUnixToMoment(customInterval.endDate));

      const convertedDate = value ? convertMomentToUnix(value) : null;
      dispatch(setCustomInterval({ startDate: convertedDate, endDate: clearEndDate ? null : customInterval.endDate }));
    },
    [customInterval, dispatch]
  );

  const onEndDateChange = useCallback(
    (value: Moment | null) => {
      const clearStartDate =
        value !== null &&
        customInterval.startDate !== null &&
        value.isBefore(convertUnixToMoment(customInterval.startDate));

      const convertedDate = value ? convertMomentToUnix(value) : null;
      dispatch(
        setCustomInterval({ startDate: clearStartDate ? null : customInterval.startDate, endDate: convertedDate })
      );
    },
    [customInterval, dispatch]
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
                value={nativeInterval.year}
                onChange={onYearChange}
                label={YEAR_LABEL}
                autoWidth
                sx={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
              >
                <MenuItem value="">Leer</MenuItem>
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
                value={nativeInterval.month}
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
                value={nativeInterval.day}
                onChange={onDayChange}
                label={DAY_LABEL}
                autoWidth
                sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
              >
                <MenuItem value="">Leer</MenuItem>
                {nativeInterval.month !== '' &&
                  days(nativeInterval.year, nativeInterval.month).map((day) => (
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
              value={customInterval.startDate ? convertUnixToMoment(customInterval.startDate) : null}
              minDate={fiftyYearsAgo}
              maxDate={inFiftyYears}
              size="small"
              onChange={onStartDateChange}
              sx={{ '& .MuiInputBase-root': { borderTopRightRadius: 0, borderBottomRightRadius: 0 } }}
            />
            <StyledDatePicker
              label="Bis"
              value={customInterval.endDate ? convertUnixToMoment(customInterval.endDate) : null}
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
