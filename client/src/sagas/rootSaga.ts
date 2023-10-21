import { takeEvery, SagaGenerator } from 'typed-redux-saga';
import {
  createCategory,
  deleteAccount,
  deleteCategory,
  loadCategories,
  login,
  logout,
  register,
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

export default function* rootSaga(): SagaGenerator<void> {
  yield* takeEvery(register, registrationSaga);
  yield* takeEvery(login, loginSaga);
  yield* takeEvery(logout, logoutSaga);
  yield* takeEvery(updateEmail, updateEmailSaga);
  yield* takeEvery(updatePassword, updatePasswordSaga);
  yield* takeEvery(deleteAccount, deleteAccountSaga);
  yield* takeEvery(loadCategories, loadCategoriesSaga);
  yield* takeEvery(createCategory, createCategorySaga);
  yield* takeEvery(deleteCategory, deleteCategorySaga);
}
