import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosError } from 'axios';
import { DASHBOARD_ROUTE, USER_URL_PATH_PREFIX } from '../utils/const';
import { clear as clearLogin, setErrors } from '../store/slices/loginSlice';
import { clear as clearRegistration } from '../store/slices/registrationSlice';
import { navigate } from '../store/slices/navigatorSlice';
import { RootState } from '../store/store';
import { validateEmail, validatePassword } from '../utils/validators';

const USER_NOT_FOUND_ERROR = 'Dieses Finence-Konto wurde nicht gefunden.';

export function* loginSaga(): SagaGenerator<void> {
  yield* put(setErrors({ email: '', password: '' }));

  const { email, password } = yield* select((state: RootState) => state.login);

  const emailError = validateEmail(email, true);
  const passwordError = validatePassword(password, true);

  if (emailError || passwordError) {
    yield* put(setErrors({ email: emailError, password: passwordError }));

    return;
  }

  yield* call(
    fetchSagaFactory(
      { url: `${USER_URL_PATH_PREFIX}login`, method: 'POST', data: { email, password } },
      function* handleResponse() {
        yield* put(clearLogin());
        yield* put(clearRegistration());
        yield* put(navigate(`/${DASHBOARD_ROUTE}`));
      },
      function* handleError(error: AxiosError) {
        if (error.response?.status === 404) {
          yield* put(setErrors({ email: USER_NOT_FOUND_ERROR, password: USER_NOT_FOUND_ERROR }));
        }
      }
    )
  );
}
