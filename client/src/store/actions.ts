import { createAction } from '@reduxjs/toolkit';

export interface LoginPayload {
  email: string;
  password: string;
}

export const login = createAction<LoginPayload>('LOGIN');
