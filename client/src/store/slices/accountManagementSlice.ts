import { PayloadAction, createSlice } from '@reduxjs/toolkit';

interface AccountManagementErrors {
  readonly email: string;
  readonly password: string;
  readonly repeatedPassword: string;
  readonly confirmation: string;
}

interface AccountManagement {
  readonly errors: AccountManagementErrors;
}

const initialState: AccountManagement = {
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
    setErrors: (state: AccountManagement, action: PayloadAction<AccountManagementErrors>) => ({
      ...state,
      errors: action.payload
    })
  }
});

export const { setErrors } = accountManagementSlice.actions;
export default accountManagementSlice.reducer;
