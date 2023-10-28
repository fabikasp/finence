import React, { useState, useEffect, useCallback } from 'react';
import { Snackbar, Slide, SlideProps, Alert } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';
import ErrorIcon from '@mui/icons-material/Error';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

function SnackbarTransition(props: SlideProps) {
  return <Slide {...props} direction="left" />;
}

export default function SnackBar(): React.ReactNode {
  const [open, setOpen] = useState(false);
  const snackBar = useSelector((state: RootState) => state.snackBar);

  useEffect(() => {
    setOpen(snackBar.open);
  }, [snackBar]);

  const onClose = useCallback(() => setOpen(false), []);

  return (
    <Snackbar
      open={open}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      autoHideDuration={6000}
      TransitionComponent={SnackbarTransition}
      onClose={onClose}
    >
      <Alert
        severity={snackBar.severity}
        onClose={onClose}
        iconMapping={{
          success: <CheckCircleIcon />,
          warning: <WarningIcon />,
          error: <ErrorIcon />
        }}
      >
        {snackBar.message}
      </Alert>
    </Snackbar>
  );
}
