import { call, put, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { LOGIN_ROUTE, USER_URL_PATH_PREFIX } from '../utils/const';
import { navigate } from '../store/slices/navigatorSlice';
import { evoke } from '../store/slices/snackBarSlice';

export function* deleteAccountSaga(): SagaGenerator<void> {
  yield* call(
    fetchSagaFactory({ url: `${USER_URL_PATH_PREFIX}`, method: 'DELETE' }, function* handleResponse() {
      yield* put(evoke({ severity: 'success', message: 'Ihr Konto wurde erfolgreich gelöscht.' }));
      yield* put(navigate(`/${LOGIN_ROUTE}`));
    })
  );
}
