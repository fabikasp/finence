import React from 'react';
import { DesktopDatePicker, DesktopDatePickerProps } from '@mui/x-date-pickers/DesktopDatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { Theme, styled } from '@mui/material/styles';
import { Moment } from 'moment';

const StyledDatePicker = styled(DesktopDatePicker<Moment>)(({ theme }) => ({
  '& .MuiSvgIcon-root': {
    color: theme.palette.secondary.main
  }
}));

type DatePickerProps = Pick<DesktopDatePickerProps<Moment>, 'label' | 'value' | 'minDate' | 'maxDate'> & {
  size: 'small' | 'medium';
  error?: boolean;
  helperText?: string;
  onChange: (value: Moment | null) => void;
};

export default function DatePicker(props: DatePickerProps): React.ReactNode {
  const { size, error, helperText } = props;

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <StyledDatePicker
        {...props}
        slotProps={{
          layout: {
            sx: (theme: Theme) => ({
              backgroundColor: '#232F3B',
              '& .MuiTypography-root': {
                color: theme.palette.secondary.main,
                fontSize: 13,
                fontWeight: 'bold'
              },
              '& .MuiSvgIcon-root': {
                color: theme.palette.secondary.main
              }
            })
          },
          textField: { size, error, helperText }
        }}
      />
    </LocalizationProvider>
  );
}
