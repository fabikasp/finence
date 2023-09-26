import { call, put, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosResponse } from 'axios';
import { ACCESS_TOKEN_KEY, USER_URL_PATH_PREFIX } from '../utils/const';
import z from 'zod';
import { assertTrue } from '../utils/assert';
import { PayloadAction } from '@reduxjs/toolkit';
import { LoginPayload } from '../store/actions';
import { setErrors, setProgressIndicator } from '../store/slices/loginSlice';

const USER_NOT_FOUND_ERROR = 'Das Finence-Konto wurde nicht gefunden.';

const loginResponseDataScheme = z.object({
  accessToken: z.string()
});

type LoginResponseData = z.infer<typeof loginResponseDataScheme>;

const isLoginResponseData = (object: unknown): object is LoginResponseData => {
  return loginResponseDataScheme.safeParse(object).success;
};

export function* loginSaga(action: PayloadAction<LoginPayload>): SagaGenerator<void> {
  yield* put(setProgressIndicator(true));

  yield* call(
    fetchSagaFactory(
      { url: `${USER_URL_PATH_PREFIX}/login`, method: 'POST', data: action.payload },
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isLoginResponseData(response.data));

        localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);

        // TODO: Zu Dashboard weiterleiten
      },
      function* handleError() {
        yield* put(setErrors({ email: USER_NOT_FOUND_ERROR, password: USER_NOT_FOUND_ERROR }));
      }
    )
  );

  yield* put(setProgressIndicator(false));
}
