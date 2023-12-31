import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface SettingsErrors {
  readonly email?: string;
  readonly password?: string;
  readonly repeatedPassword?: string;
  readonly confirmation?: string;
}

interface Settings {
  readonly email: string;
  readonly comparativeEmail: string;
  readonly password: string;
  readonly repeatedPassword: string;
  readonly confirmation: string;
  readonly errors?: SettingsErrors;
}

const initialState: Settings = {
  email: '',
  comparativeEmail: '',
  password: '',
  repeatedPassword: '',
  confirmation: ''
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setEmail: (state: Settings, action: PayloadAction<string>) => ({ ...state, email: action.payload }),
    setComparativeEmail: (state: Settings, action: PayloadAction<string>) => ({
      ...state,
      comparativeEmail: action.payload
    }),
    setPassword: (state: Settings, action: PayloadAction<string>) => ({ ...state, password: action.payload }),
    setRepeatedPassword: (state: Settings, action: PayloadAction<string>) => ({
      ...state,
      repeatedPassword: action.payload
    }),
    setConfirmation: (state: Settings, action: PayloadAction<string>) => ({
      ...state,
      confirmation: action.payload
    }),
    setErrors: (state: Settings, action: PayloadAction<SettingsErrors>) => ({
      ...state,
      errors: action.payload
    }),
    clear: () => initialState
  }
});

export const { setEmail, setComparativeEmail, setPassword, setRepeatedPassword, setConfirmation, setErrors, clear } =
  settingsSlice.actions;
export default settingsSlice.reducer;
