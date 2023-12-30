import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface RegistrationErrors {
  readonly email?: string;
  readonly password?: string;
  readonly repeatedPassword?: string;
}

interface Registration {
  readonly email: string;
  readonly password: string;
  readonly repeatedPassword: string;
  readonly errors?: RegistrationErrors;
}

const initialState: Registration = {
  email: '',
  password: '',
  repeatedPassword: ''
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setEmail: (state: Registration, action: PayloadAction<string>) => ({ ...state, email: action.payload }),
    setPassword: (state: Registration, action: PayloadAction<string>) => ({ ...state, password: action.payload }),
    setRepeatedPassword: (state: Registration, action: PayloadAction<string>) => ({
      ...state,
      repeatedPassword: action.payload
    }),
    setErrors: (state: Registration, action: PayloadAction<RegistrationErrors>) => ({
      ...state,
      errors: action.payload
    }),
    clearErrors: (state: Registration) => ({ ...state, errors: undefined }),
    clear: () => initialState
  }
});

export const { setEmail, setPassword, setRepeatedPassword, setErrors, clearErrors, clear } = registrationSlice.actions;
export default registrationSlice.reducer;
