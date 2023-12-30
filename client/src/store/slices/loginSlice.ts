import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface LoginErrors {
  readonly email?: string;
  readonly password?: string;
}

interface Login {
  readonly email: string;
  readonly password: string;
  readonly errors?: LoginErrors;
}

const initialState: Login = {
  email: '',
  password: ''
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setEmail: (state: Login, action: PayloadAction<string>) => ({ ...state, email: action.payload }),
    setPassword: (state: Login, action: PayloadAction<string>) => ({ ...state, password: action.payload }),
    setErrors: (state: Login, action: PayloadAction<LoginErrors>) => ({ ...state, errors: action.payload }),
    clearErrors: (state: Login) => ({ ...state, errors: undefined }),
    clear: () => initialState
  }
});

export const { setEmail, setPassword, setErrors, clearErrors, clear } = loginSlice.actions;
export default loginSlice.reducer;
