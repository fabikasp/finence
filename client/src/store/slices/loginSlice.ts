import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface LoginErrors {
  readonly email: string;
  readonly password: string;
}

interface Login {
  readonly errors: LoginErrors;
  readonly showProgressIndicator: boolean;
}

const initialState: Login = {
  errors: {
    email: '',
    password: ''
  },
  showProgressIndicator: false
};

const loginSlice = createSlice({
  name: 'login',
  initialState: initialState,
  reducers: {
    setErrors: (state: Login, action: PayloadAction<LoginErrors>) => ({ ...state, errors: action.payload }),
    setProgressIndicator: (state: Login, action: PayloadAction<boolean>) => ({
      ...state,
      showProgressIndicator: action.payload
    })
  }
});

export const { setErrors, setProgressIndicator } = loginSlice.actions;
export default loginSlice.reducer;
