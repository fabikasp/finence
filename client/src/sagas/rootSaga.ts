import { takeEvery, SagaGenerator } from 'typed-redux-saga';
import {
  createBooking,
  createCategory,
  deleteAccount,
  deleteBooking,
  deleteCategory,
  loadBookings,
  loadCategories,
  loadUser,
  login,
  logout,
  register,
  updateCategory,
  updateEmail,
  updatePassword
} from '../store/actions';
import { loginSaga } from './loginSaga';
import { logoutSaga } from './logoutSaga';
import { registrationSaga } from './registrationSaga';
import { updateEmailSaga } from './updateEmailSaga';
import { updatePasswordSaga } from './updatePasswordSaga';
import { deleteAccountSaga } from './deleteAccountSaga';
import { loadCategoriesSaga } from './loadCategoriesSaga';
import { deleteCategorySaga } from './deleteCategorySaga';
import { createCategorySaga } from './createCategorySaga';
import { loadUserSaga } from './loadUserSaga';
import { updateCategorySaga } from './updateCategorySaga';
import { loadBookingsSaga } from './loadBookingsSaga';
import { createBookingSaga } from './createBookingSaga';
import { deleteBookingSaga } from './deleteBookingSaga';

export default function* rootSaga(): SagaGenerator<void> {
  yield* takeEvery(register, registrationSaga);
  yield* takeEvery(login, loginSaga);
  yield* takeEvery(logout, logoutSaga);
  yield* takeEvery(loadUser, loadUserSaga);
  yield* takeEvery(updateEmail, updateEmailSaga);
  yield* takeEvery(updatePassword, updatePasswordSaga);
  yield* takeEvery(deleteAccount, deleteAccountSaga);

  yield* takeEvery(loadCategories, loadCategoriesSaga);
  yield* takeEvery(createCategory, createCategorySaga);
  yield* takeEvery(updateCategory, updateCategorySaga);
  yield* takeEvery(deleteCategory, deleteCategorySaga);

  yield* takeEvery(loadBookings, loadBookingsSaga);
  yield* takeEvery(createBooking, createBookingSaga);
  yield* takeEvery(deleteBooking, deleteBookingSaga);
}
