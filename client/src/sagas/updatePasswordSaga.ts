import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { USER_URL_PATH_PREFIX } from '../utils/const';
import { evoke } from '../store/slices/snackBarSlice';
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

  yield* call(
    fetchSagaFactory({ url: `${USER_URL_PATH_PREFIX}`, method: 'PUT', data: { password } }, function* handleResponse() {
      yield* put(setPassword(''));
      yield* put(setRepeatedPassword(''));
      yield* put(evoke({ severity: 'success', message: 'Ihr Passwort wurde erfolgreich geändert.' }));
    })
  );
}
