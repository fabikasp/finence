import { call, put, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosError, AxiosResponse } from 'axios';
import { ACCESS_TOKEN_KEY, DASHBOARD_ROUTE, USER_URL_PATH_PREFIX } from '../utils/const';
import { assertTrue } from '../utils/assert';
import { PayloadAction } from '@reduxjs/toolkit';
import { navigate } from '../store/slices/navigatorSlice';
import { UserPayload } from '../store/actions';
import { evoke } from '../store/slices/snackBarSlice';
import { clear as clearRegistration, setErrors } from '../store/slices/registrationSlice';
import { clear as clearLogin } from '../store/slices/loginSlice';
import z from 'zod';

const USER_ALREADY_EXISTS_ERROR = 'Es existiert bereits ein Konto mit dieser E-Mail-Adresse.';

const registrationResponseDataScheme = z.object({
  accessToken: z.string()
});

type RegistrationResponseData = z.infer<typeof registrationResponseDataScheme>;

const isRegistrationResponseData = (object: unknown): object is RegistrationResponseData => {
  return registrationResponseDataScheme.safeParse(object).success;
};

export function* registrationSaga(action: PayloadAction<UserPayload>): SagaGenerator<void> {
  yield* call(
    fetchSagaFactory(
      { url: `${USER_URL_PATH_PREFIX}/register`, method: 'POST', data: action.payload },
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isRegistrationResponseData(response.data));

        localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);

        yield* put(clearRegistration());
        yield* put(clearLogin());
        yield* put(evoke({ severity: 'success', message: 'Die Registrierung war erfolgreich.' }));
        yield* put(navigate(`/${DASHBOARD_ROUTE}`));
      },
      function* handleError(error: AxiosError) {
        if (error.response?.status === 409) {
          yield* put(setErrors({ email: USER_ALREADY_EXISTS_ERROR, password: '', repeatedPassword: '' }));
        }
      },
      true
    )
  );
}
