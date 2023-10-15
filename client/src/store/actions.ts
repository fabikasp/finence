import { createAction } from '@reduxjs/toolkit';

export const register = createAction('REGISTER');
export const login = createAction('LOGIN');
export const logout = createAction('LOGOUT');
export const updateEmail = createAction('UPDATE_EMAIL');
export const updatePassword = createAction('UPDATE_PASSWORD');
export const deleteAccount = createAction('DELETE_ACCOUNT');

export const loadCategories = createAction('LOAD_CATEGORIES');
export const deleteCategory = createAction<number>('DELETE_CATEGORY');
