import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AlertColor } from '@mui/material';

interface SnackBar {
  readonly open: boolean;
  readonly severity: AlertColor;
  readonly message: string;
}

const initialState: SnackBar = { open: false, severity: 'success', message: '' };

const snackBarSlice = createSlice({
  name: 'snackBar',
  initialState,
  reducers: {
    evoke: (_: SnackBar, action: PayloadAction<Pick<SnackBar, 'severity' | 'message'>>) => ({
      open: true,
      severity: action.payload.severity,
      message: action.payload.message
    }),
    evokeExpiredSessionError: () => ({
      open: true,
      severity: 'error' as AlertColor,
      message: 'Ihre Sitzung ist abgelaufen.'
    }),
    evokeUnknownError: () => ({
      open: true,
      severity: 'error' as AlertColor,
      message: 'Es ist ein unbekannter Fehler aufgetreten.'
    })
  }
});

export const { evoke, evokeExpiredSessionError, evokeUnknownError } = snackBarSlice.actions;
export default snackBarSlice.reducer;
