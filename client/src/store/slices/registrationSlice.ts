import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface RegistrationErrors {
  readonly email: string;
  readonly password: string;
  readonly repeatedPassword: string;
}

interface Registration {
  readonly errors: RegistrationErrors;
}

const initialState: Registration = {
  errors: {
    email: '',
    password: '',
    repeatedPassword: ''
  }
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    setErrors: (_: Registration, action: PayloadAction<RegistrationErrors>) => ({ errors: action.payload })
  }
});

export const { setErrors } = registrationSlice.actions;
export default registrationSlice.reducer;
