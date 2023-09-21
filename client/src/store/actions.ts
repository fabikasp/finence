import { createAction } from '@reduxjs/toolkit';

interface LoginPayload {
  email: string;
  password: string;
}

export const login = createAction<LoginPayload>('LOGIN');
