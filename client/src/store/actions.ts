import { createAction } from '@reduxjs/toolkit';

export interface UserPayload {
  email: string;
  password: string;
}

export const register = createAction<UserPayload>('REGISTER');

export const login = createAction<UserPayload>('LOGIN');

export const logout = createAction('LOGOUT');
