import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface LoginErrors {
  readonly email: string;
  readonly password: string;
}

interface Login {
  readonly errors: LoginErrors;
}

const initialState: Login = {
  errors: {
    email: '',
    password: ''
  }
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setErrors: (_: Login, action: PayloadAction<LoginErrors>) => ({ errors: action.payload })
  }
});

export const { setErrors } = loginSlice.actions;
export default loginSlice.reducer;
