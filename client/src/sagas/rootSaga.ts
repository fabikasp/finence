import { takeEvery, SagaGenerator } from 'typed-redux-saga';
import { login, logout } from '../store/actions';
import { loginSaga } from './loginSaga';
import { logoutSaga } from './logoutSaga';

export default function* rootSaga(): SagaGenerator<void> {
  yield* takeEvery(login, loginSaga);
  yield* takeEvery(logout, logoutSaga);
}
