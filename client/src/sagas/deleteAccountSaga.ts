import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { LOGIN_ROUTE, USER_URL_PATH_PREFIX } from '../utils/const';
import { navigate } from '../store/slices/navigatorSlice';
import { evoke, evokeExpiredSessionError } from '../store/slices/snackBarSlice';
import { getDecodedJwt } from '../utils/helper';
import { setErrors } from '../store/slices/accountManagementSlice';
import { RootState } from '../store/store';
import { validateConfirmation } from '../utils/validators';

export function* deleteAccountSaga(): SagaGenerator<void> {
  const errors = yield* select((state: RootState) => state.accountManagement.errors);

  yield* put(setErrors({ ...errors, confirmation: '' }));

  const { confirmation } = yield* select((state: RootState) => state.accountManagement);
  const confirmationError = validateConfirmation(confirmation);

  if (confirmationError) {
    yield* put(setErrors({ ...errors, confirmation: confirmationError }));

    return;
  }

  const decodedJwt = getDecodedJwt();
  if (!decodedJwt) {
    yield* put(evokeExpiredSessionError());
    yield* put(navigate(`/${LOGIN_ROUTE}`));

    return;
  }

  yield* call(
    fetchSagaFactory(
      { url: `${USER_URL_PATH_PREFIX}/delete/${decodedJwt.sub}`, method: 'DELETE' },
      function* handleResponse() {
        yield* put(evoke({ severity: 'success', message: 'Ihr Konto wurde erfolgreich gelöscht.' }));
        yield* put(navigate(`/${LOGIN_ROUTE}`));
      }
    )
  );
}
