import React, { useState, useEffect } from 'react';
import { Alert, AlertColor, AlertProps, Snackbar, Slide, SlideProps } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
import { styled } from '@mui/material/styles';

interface StyledAlertProps extends AlertProps {
  readonly severity: AlertColor;
}

interface ColorMapping {
  [severity: string]: string;
}

const StyledAlert = styled(Alert)<StyledAlertProps>(({ theme, severity }) => {
  const colorMapping: ColorMapping = {
    info: theme.palette.info.main,
    success: theme.palette.success.main,
    warning: theme.palette.warning.main,
    error: theme.palette.error.main
  };

  return {
    border: `2px solid ${colorMapping[severity]}`,
    '& .MuiAlert-icon': {
      color: colorMapping[severity]
    },
    '& .MuiAlert-action': {
      color: colorMapping[severity]
    }
  };
});

function SnackbarTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export default function SnackBar(): React.ReactNode {
  const [open, setOpen] = useState(true);
  const snackBar = useSelector((state: RootState) => state.snackBar);

  useEffect(() => {
    setOpen(snackBar.open);
  }, [snackBar]);

  const onClose = () => setOpen(false);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={6000}
      TransitionComponent={SnackbarTransition}
      onClose={onClose}
    >
      <StyledAlert severity={snackBar.severity} onClose={onClose}>
        {snackBar.message}
      </StyledAlert>
    </Snackbar>
  );
}
