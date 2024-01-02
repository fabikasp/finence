import { createAction } from '@reduxjs/toolkit';

export const register = createAction('REGISTER');
export const login = createAction('LOGIN');
export const logout = createAction('LOGOUT');
export const loadUser = createAction('LOAD_USER');
export const updateEmail = createAction('UPDATE_EMAIL');
export const updatePassword = createAction('UPDATE_PASSWORD');
export const deleteAccount = createAction('DELETE_ACCOUNT');

export interface CreateCategoryPayload {
  closeDialog: boolean;
}

export const loadCategories = createAction('LOAD_CATEGORIES');
export const createCategory = createAction<CreateCategoryPayload>('CREATE_CATEGORY');
export const updateCategory = createAction('UPDATE_CATEGORY');
export const deleteCategory = createAction('DELETE_CATEGORY');

export interface CreateBookingPayload {
  closeDialog: boolean;
}

export const loadBookings = createAction('LOAD_BOOKINGS');
export const createBooking = createAction<CreateBookingPayload>('CREATE_BOOKING');
export const updateBooking = createAction('UPDATE_BOOKING');
export const deleteBooking = createAction('DELETE_BOOKING');
