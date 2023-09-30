import { call, put, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosError, AxiosResponse } from 'axios';
import { ACCESS_TOKEN_KEY, DASHBOARD_ROUTE, USER_URL_PATH_PREFIX } from '../utils/const';
import { assertTrue } from '../utils/assert';
import { PayloadAction } from '@reduxjs/toolkit';
import { UserPayload } from '../store/actions';
import { clear as clearLogin, setErrors } from '../store/slices/loginSlice';
import { clear as clearRegistration } from '../store/slices/registrationSlice';
import { navigate } from '../store/slices/navigatorSlice';
import z from 'zod';

const USER_NOT_FOUND_ERROR = 'Das Finence-Konto wurde nicht gefunden.';

const loginResponseDataScheme = z.object({
  accessToken: z.string()
});

type LoginResponseData = z.infer<typeof loginResponseDataScheme>;

const isLoginResponseData = (object: unknown): object is LoginResponseData => {
  return loginResponseDataScheme.safeParse(object).success;
};

export function* loginSaga(action: PayloadAction<UserPayload>): SagaGenerator<void> {
  yield* call(
    fetchSagaFactory(
      { url: `${USER_URL_PATH_PREFIX}/login`, method: 'POST', data: action.payload },
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isLoginResponseData(response.data));

        localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);

        yield* put(clearLogin());
        yield* put(clearRegistration());
        yield* put(navigate(`/${DASHBOARD_ROUTE}`));
      },
      function* handleError(error: AxiosError) {
        if (error.response?.status === 401) {
          yield* put(setErrors({ email: USER_NOT_FOUND_ERROR, password: USER_NOT_FOUND_ERROR }));
        }
      },
      true
    )
  );
}
