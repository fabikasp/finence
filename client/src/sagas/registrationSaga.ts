import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosError } from 'axios';
import { DASHBOARD_ROUTE, USER_URL_PATH_PREFIX } from '../utils/const';
import { navigate } from '../store/slices/navigatorSlice';
import { evoke } from '../store/slices/snackBarSlice';
import { clearErrors, clear as clearRegistration, setErrors } from '../store/slices/registrationSlice';
import { clear as clearLogin } from '../store/slices/loginSlice';
import { validateEmail, validatePassword, validateRepeatedPassword } from '../utils/validators';
import { RootState } from '../store/store';

const USER_ALREADY_EXISTS_ERROR = 'Es existiert bereits ein Konto mit dieser E-Mail-Adresse.';

export function* registrationSaga(): SagaGenerator<void> {
  yield* put(clearErrors());

  const { email, password, repeatedPassword } = yield* select((state: RootState) => state.registration);

  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);
  const repeatedPasswordError = validateRepeatedPassword(repeatedPassword, password);

  if (emailError || passwordError || repeatedPasswordError) {
    yield* put(setErrors({ email: emailError, password: passwordError, repeatedPassword: repeatedPasswordError }));

    return;
  }

  yield* call(
    fetchSagaFactory(
      { url: `${USER_URL_PATH_PREFIX}register`, method: 'POST', data: { email, password } },
      function* handleResponse() {
        yield* put(clearRegistration());
        yield* put(clearLogin());
        yield* put(evoke({ severity: 'success', message: 'Du hast dich erfolgreich registriert.' }));
        yield* put(navigate(`/${DASHBOARD_ROUTE}`));
      },
      function* handleError(error: AxiosError) {
        if (error.response?.status === 409) {
          yield* put(setErrors({ email: USER_ALREADY_EXISTS_ERROR }));
        }
      }
    )
  );
}
