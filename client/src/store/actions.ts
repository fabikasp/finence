import { createAction } from '@reduxjs/toolkit';

export const register = createAction('REGISTER');

export const login = createAction('LOGIN');

export const logout = createAction('LOGOUT');

export interface UpdateAccountPayload {
  email?: string;
  password?: string;
}

export const updateAccount = createAction<UpdateAccountPayload>('UPDATE_ACCOUNT');

export const deleteAccount = createAction('DELETE_ACCOUNT');
