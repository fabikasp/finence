import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { AlertColor } from '@mui/material';

const DEFAULT_SEVERITY: AlertColor = 'error';
const DEFAULT_MESSAGE = 'Es ist ein unbekannter Fehler aufgetreten.';

interface SnackBar {
  readonly open: boolean;
  readonly severity: AlertColor;
  readonly message: string;
}

const initialState: SnackBar = { open: false, severity: DEFAULT_SEVERITY, message: DEFAULT_MESSAGE };

const snackBarSlice = createSlice({
  name: 'snackBar',
  initialState,
  reducers: {
    evoke: (_: SnackBar, action: PayloadAction<Pick<SnackBar, 'severity' | 'message'>>) => ({
      open: true,
      severity: action.payload.severity,
      message: action.payload.message
    }),
    evokeDefault: (_: SnackBar) => ({
      open: true,
      severity: DEFAULT_SEVERITY,
      message: DEFAULT_MESSAGE
    })
  }
});

export const { evoke, evokeDefault } = snackBarSlice.actions;
export default snackBarSlice.reducer;
