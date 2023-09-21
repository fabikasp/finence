import { takeEvery, SagaGenerator } from 'typed-redux-saga';
import { login } from '../store/actions';
import { loginSaga } from './loginSaga';

export default function* rootSaga(): SagaGenerator<void> {
  yield* takeEvery(login, loginSaga);
}
