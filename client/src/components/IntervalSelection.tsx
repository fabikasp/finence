import React, { useMemo, useCallback } from 'react';
import { Box, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, IconButton, Zoom } from '@mui/material';
import SwapVerticalCircleOutlinedIcon from '@mui/icons-material/SwapVerticalCircleOutlined';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { styled } from '@mui/material/styles';
import moment, { Moment } from 'moment';
import 'moment/locale/de';
import DatePicker from './DatePicker';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { useDispatch } from 'react-redux';
import {
  setCustomInterval,
  setNativeInterval,
  toggleCustomIntervalEnabled
} from '../store/slices/intervalSelectionSlice';
import { convertMomentToUnix, convertUnixToMoment, createMoment } from '../utils/helper';

const YEAR_LABEL = 'Jahr';
const MONTH_LABEL = 'Monat';
const DAY_LABEL = 'Tag';

type IntervalSelectionProps = {
  readonly useMargin?: boolean;
};

const StyledDatePicker = styled(DatePicker, {
  shouldForwardProp: (prop) => prop !== 'useMargin'
})<IntervalSelectionProps>(({ theme, useMargin }) => ({
  [theme.breakpoints.up('md')]: {
    width: '30%'
  },
  ...(useMargin && {
    margin: '20px 0px 10px'
  })
}));

const StyledFormControl = styled(FormControl, {
  shouldForwardProp: (prop) => prop !== 'useMargin'
})<IntervalSelectionProps>(({ useMargin }) => ({
  ...(useMargin && {
    margin: '20px 0px 10px'
  })
}));

const SwapButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'useMargin'
})<IntervalSelectionProps>(({ useMargin }) => ({
  margin: `${useMargin ? '10px' : '0px'} 10px 0px ${useMargin ? '10px' : '0px'}`
}));

const ArrowButton = styled(IconButton, {
  shouldForwardProp: (prop) => prop !== 'useMargin'
})<IntervalSelectionProps>(({ useMargin }) => ({
  margin: `${useMargin ? '10px' : '0px'} 0px 0px 10px`
}));

export default function IntervalSelection(props: IntervalSelectionProps): React.ReactNode {
  const { useMargin } = props;

  const dispatch = useDispatch();
  const { customIntervalEnabled, nativeInterval, customInterval } = useSelector(
    (state: RootState) => state.intervalSelection
  );

  const fiftyYearsAgo = useMemo(() => moment().subtract(50, 'years'), []);
  const inFiftyYears = useMemo(() => moment().add(50, 'years'), []);

  const years = useMemo(
    () => Array.from({ length: 101 }, (_, i) => (inFiftyYears.year() - (101 - i)).toString()),
    [inFiftyYears]
  );
  const months = useMemo(() => moment.monthsShort(), []);
  const days = useCallback((year: string, monthName: string) => {
    const countDays = moment(year + '-' + moment().month(monthName).format('M'), 'YYYY-MM').daysInMonth();

    return Array.from({ length: countDays }, (_, i) => (++i).toString());
  }, []);

  const onSwap = useCallback(() => dispatch(toggleCustomIntervalEnabled()), [dispatch]);

  const onYearChange = useCallback(
    (event: SelectChangeEvent) => dispatch(setNativeInterval({ year: event.target.value, month: '', day: '' })),
    [dispatch]
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

  const onSkip = useCallback(
    (forward: boolean) => () => {
      if (!nativeInterval.year) {
        return;
      }

      const unit = nativeInterval.day ? 'days' : nativeInterval.month ? 'months' : 'years';
      const currentDate = createMoment(
        +nativeInterval.year,
        unit !== 'years' ? nativeInterval.month : undefined,
        unit === 'days' ? +nativeInterval.day : undefined
      );
      const newDate = forward ? currentDate.add(1, unit) : currentDate.subtract(1, unit);

      dispatch(
        setNativeInterval({
          ...nativeInterval,
          year: newDate.year().toString(),
          ...(unit !== 'years' && { month: months[newDate.month()] }),
          ...(unit === 'days' && { day: newDate.date().toString() })
        })
      );
    },
    [nativeInterval, months, dispatch]
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
      <SwapButton color="primary" onClick={onSwap} useMargin={useMargin}>
        <SwapVerticalCircleOutlinedIcon />
      </SwapButton>
      {!customIntervalEnabled && (
        <Zoom in style={{ transitionDelay: '0ms' }}>
          <Box>
            <StyledFormControl sx={{ minWidth: 80 }} size="small" useMargin={useMargin}>
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
            <StyledFormControl sx={{ minWidth: 90 }} size="small" useMargin={useMargin}>
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
                {nativeInterval.year &&
                  months.map((month) => (
                    <MenuItem key={month} value={month}>
                      {month}
                    </MenuItem>
                  ))}
              </Select>
            </StyledFormControl>
            <StyledFormControl sx={{ minWidth: 70 }} size="small" useMargin={useMargin}>
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
                {nativeInterval.month &&
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
              useMargin={useMargin}
            />
            <StyledDatePicker
              label="Bis"
              value={customInterval.endDate ? convertUnixToMoment(customInterval.endDate) : null}
              minDate={fiftyYearsAgo}
              maxDate={inFiftyYears}
              size="small"
              onChange={onEndDateChange}
              sx={{ '& .MuiInputBase-root': { borderTopLeftRadius: 0, borderBottomLeftRadius: 0 } }}
              useMargin={useMargin}
            />
          </Box>
        </Zoom>
      )}
      {!customIntervalEnabled && (
        <>
          <ArrowButton color="primary" onClick={onSkip(false)} useMargin={useMargin}>
            <ArrowBackIosIcon />
          </ArrowButton>
          <ArrowButton color="primary" onClick={onSkip(true)} useMargin={useMargin} sx={{ marginLeft: 0 }}>
            <ArrowForwardIosIcon />
          </ArrowButton>
        </>
      )}
    </Box>
  );
}
