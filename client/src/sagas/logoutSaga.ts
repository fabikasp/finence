import { call, put, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { LOGIN_ROUTE, USER_URL_PATH_PREFIX } from '../utils/const';
import { navigate } from '../store/slices/navigatorSlice';

export function* logoutSaga(): SagaGenerator<void> {
  yield* call(
    fetchSagaFactory({ url: `${USER_URL_PATH_PREFIX}logout`, method: 'POST' }, function* handleResponse() {
      yield* put(navigate(`/${LOGIN_ROUTE}`));
    })
  );
}
