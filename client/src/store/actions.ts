import { createAction } from '@reduxjs/toolkit';

export const register = createAction('REGISTER');
export const login = createAction('LOGIN');
export const logout = createAction('LOGOUT');
export const loadUser = createAction('LOAD_USER');
export const updateEmail = createAction('UPDATE_EMAIL');
export const updatePassword = createAction('UPDATE_PASSWORD');
export const deleteAccount = createAction('DELETE_ACCOUNT');

export interface CreateCategoryPayload {
  readonly closeDialog: boolean;
}

export const loadCategories = createAction('LOAD_CATEGORIES');
export const createCategory = createAction<CreateCategoryPayload>('CREATE_CATEGORY');
export const updateCategory = createAction('UPDATE_CATEGORY');
export const deleteCategory = createAction('DELETE_CATEGORY');

export interface CreateBookingPayload {
  readonly closeDialog: boolean;
}

export interface ImportBookingImagePayload {
  readonly mode: 'create' | 'update';
  readonly imageUrl: string;
}

export const loadBookings = createAction('LOAD_BOOKINGS');
export const createBooking = createAction<CreateBookingPayload>('CREATE_BOOKING');
export const importBookingImage = createAction<ImportBookingImagePayload>('IMPORT_BOOKING_IMAGE');
export const updateBooking = createAction('UPDATE_BOOKING');
export const deleteBooking = createAction('DELETE_BOOKING');

export const loadColumnMapping = createAction('LOAD_COLUMN_MAPPING');
export const persistColumnMapping = createAction('PERSIST_COLUMN_MAPPING');
export const importAccountStatement = createAction('IMPORT_ACCOUNT_STATEMENT');
