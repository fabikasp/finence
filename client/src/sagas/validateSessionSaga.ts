import { call, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { USER_URL_PATH_PREFIX } from '../utils/const';

export function* validateSessionSaga(): SagaGenerator<void> {
  yield* call(fetchSagaFactory({ url: `${USER_URL_PATH_PREFIX}/validateSession` }));
}
