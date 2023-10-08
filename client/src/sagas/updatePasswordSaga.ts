import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { LOGIN_ROUTE, USER_URL_PATH_PREFIX } from '../utils/const';
import { navigate } from '../store/slices/navigatorSlice';
import { evoke } from '../store/slices/snackBarSlice';
import { getDecodedJwt } from '../utils/helper';
import { setErrors, setPassword, setRepeatedPassword } from '../store/slices/settingsSlice';
import { RootState } from '../store/store';
import { validatePassword, validateRepeatedPassword } from '../utils/validators';

export function* updatePasswordSaga(): SagaGenerator<void> {
  const { password, repeatedPassword, errors } = yield* select((state: RootState) => state.settings);

  yield* put(setErrors({ ...errors, password: '', repeatedPassword: '' }));

  const passwordError = validatePassword(password);
  const repeatedPasswordError = validateRepeatedPassword(repeatedPassword, password);

  if (passwordError || repeatedPasswordError) {
    yield* put(setErrors({ ...errors, password: passwordError, repeatedPassword: repeatedPasswordError }));

    return;
  }

  const decodedJwt = getDecodedJwt();
  if (!decodedJwt) {
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
