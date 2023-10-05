import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AccountManagementErrors {
  readonly email: string;
  readonly password: string;
  readonly repeatedPassword: string;
  readonly confirmation: string;
}

interface AccountManagement {
  readonly email: string;
  readonly password: string;
  readonly repeatedPassword: string;
  readonly confirmation: string;
  readonly errors: AccountManagementErrors;
}

const initialState: AccountManagement = {
  email: '',
  password: '',
  repeatedPassword: '',
  confirmation: '',
  errors: {
    email: '',
    password: '',
    repeatedPassword: '',
    confirmation: ''
  }
};

const accountManagementSlice = createSlice({
  name: 'accountManagement',
  initialState,
  reducers: {
    setEmail: (state: AccountManagement, action: PayloadAction<string>) => ({ ...state, email: action.payload }),
    setPassword: (state: AccountManagement, action: PayloadAction<string>) => ({ ...state, password: action.payload }),
    setRepeatedPassword: (state: AccountManagement, action: PayloadAction<string>) => ({
      ...state,
      repeatedPassword: action.payload
    }),
    setConfirmation: (state: AccountManagement, action: PayloadAction<string>) => ({
      ...state,
      confirmation: action.payload
    }),
    setErrors: (state: AccountManagement, action: PayloadAction<AccountManagementErrors>) => ({
      ...state,
      errors: action.payload
    })
  }
});

export const { setEmail, setPassword, setRepeatedPassword, setConfirmation, setErrors } =
  accountManagementSlice.actions;
export default accountManagementSlice.reducer;
