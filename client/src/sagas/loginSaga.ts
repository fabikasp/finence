import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosError, AxiosResponse } from 'axios';
import { DASHBOARD_ROUTE, USER_EMAIL_KEY, USER_URL_PATH_PREFIX } from '../utils/const';
import { assertTrue } from '../utils/assert';
import { clear as clearLogin, setErrors } from '../store/slices/loginSlice';
import { clear as clearRegistration } from '../store/slices/registrationSlice';
import { navigate } from '../store/slices/navigatorSlice';
import { RootState } from '../store/store';
import { validateEmail, validatePassword } from '../utils/validators';
import z from 'zod';

const USER_NOT_FOUND_ERROR = 'Dieses Finence-Konto wurde nicht gefunden.';

const loginResponseDataScheme = z.object({
  email: z.string()
});

type LoginResponseData = z.infer<typeof loginResponseDataScheme>;

const isLoginResponseData = (object: unknown): object is LoginResponseData => {
  return loginResponseDataScheme.safeParse(object).success;
};

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
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isLoginResponseData(response.data));

        localStorage.setItem(USER_EMAIL_KEY, response.data.email);

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
