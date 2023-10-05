import React, { useState, useEffect } from 'react';
import { Alert, Snackbar, Slide, SlideProps } from '@mui/material';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

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
      <Alert severity={snackBar.severity} onClose={onClose} variant="filled">
        {snackBar.message}
      </Alert>
    </Snackbar>
  );
}
