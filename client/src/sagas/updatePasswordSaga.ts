import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { LOGIN_ROUTE, USER_URL_PATH_PREFIX } from '../utils/const';
import { navigate } from '../store/slices/navigatorSlice';
import { evoke, evokeExpiredSessionError } from '../store/slices/snackBarSlice';
import { getDecodedJwt } from '../utils/helper';
import { setErrors, setPassword, setRepeatedPassword } from '../store/slices/accountManagementSlice';
import { RootState } from '../store/store';
import { validatePassword, validateRepeatedPassword } from '../utils/validators';

export function* updatePasswordSaga(): SagaGenerator<void> {
  const errors = yield* select((state: RootState) => state.accountManagement.errors);

  yield* put(setErrors({ ...errors, password: '', repeatedPassword: '' }));

  const { password, repeatedPassword } = yield* select((state: RootState) => state.accountManagement);

  const passwordError = validatePassword(password);
  const repeatedPasswordError = validateRepeatedPassword(repeatedPassword, password);

  if (passwordError || repeatedPasswordError) {
    yield* put(setErrors({ ...errors, password: passwordError, repeatedPassword: repeatedPasswordError }));

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
      { url: `${USER_URL_PATH_PREFIX}/update/${decodedJwt.sub}`, method: 'PUT', data: { password } },
      function* handleResponse() {
        yield* put(setPassword(''));
        yield* put(setRepeatedPassword(''));
        yield* put(evoke({ severity: 'success', message: 'Ihr Passwort wurde erfolgreich geändert.' }));
      }
    )
  );
}
