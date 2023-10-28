import React, { useState } from 'react';
import { Box, FormControl, InputLabel, Select, SelectChangeEvent, MenuItem, IconButton, Zoom } from '@mui/material';
import SwapVerticalCircleIcon from '@mui/icons-material/SwapVerticalCircle';
import { styled } from '@mui/material/styles';
import { days, months, years } from '../utils/providers';

const YEAR_LABEL = 'Jahr';
const MONTH_LABEL = 'Monat';
const DAY_LABEL = 'Tag';

const StyledFormControl = styled(FormControl)(() => ({
  minWidth: 90,
  margin: '20px 10px 10px'
}));

export default function IntervalSelection(): React.ReactNode {
  const [customIntervalEnabled, setCustomIntervalEnabled] = useState(false);
  const [year, setYear] = useState<string>(years[0]);
  const [month, setMonth] = useState<string>('');
  const [day, setDay] = useState<string>('');

  const onSwap = () => setCustomIntervalEnabled((state) => !state);

  const onYearChange = (event: SelectChangeEvent) => {
    if (day !== '') {
      setDay('');
    }

    setYear(event.target.value);
  };

  const onMonthChange = (event: SelectChangeEvent) => {
    if (day !== '') {
      setDay('');
    }

    setMonth(event.target.value);
  };

  const onDayChange = (event: SelectChangeEvent) => setDay(event.target.value);

  return (
    <Box display="flex">
      <IconButton color="primary" onClick={onSwap}>
        <SwapVerticalCircleIcon fontSize="large" />
      </IconButton>
      {!customIntervalEnabled && (
        <Zoom in={true} style={{ transitionDelay: '0ms' }}>
          <Box>
            <StyledFormControl>
              <InputLabel id="year-label">{YEAR_LABEL}</InputLabel>
              <Select labelId="year-label" value={year} onChange={onYearChange} label={YEAR_LABEL} autoWidth>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
            <StyledFormControl>
              <InputLabel id="month-label">{MONTH_LABEL}</InputLabel>
              <Select labelId="month-label" value={month} onChange={onMonthChange} label={MONTH_LABEL} autoWidth>
                <MenuItem value="">Leer</MenuItem>
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
            <StyledFormControl>
              <InputLabel id="day-label">{DAY_LABEL}</InputLabel>
              <Select labelId="day-label" value={day} onChange={onDayChange} label={DAY_LABEL} autoWidth>
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
        <Zoom in={true} style={{ transitionDelay: '0ms' }}>
          <Box>
            <StyledFormControl>
              <InputLabel id="year-label">{YEAR_LABEL}</InputLabel>
              <Select labelId="year-label" value={year} onChange={onYearChange} label={YEAR_LABEL} autoWidth>
                {years.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
            <StyledFormControl>
              <InputLabel id="month-label">{MONTH_LABEL}</InputLabel>
              <Select labelId="month-label" value={month} onChange={onMonthChange} label={MONTH_LABEL} autoWidth>
                <MenuItem value="">Leer</MenuItem>
                {months.map((month) => (
                  <MenuItem key={month} value={month}>
                    {month}
                  </MenuItem>
                ))}
              </Select>
            </StyledFormControl>
          </Box>
        </Zoom>
      )}
    </Box>
  );
}
