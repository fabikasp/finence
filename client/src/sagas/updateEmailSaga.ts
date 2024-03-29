import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosError, AxiosResponse } from 'axios';
import { USER_URL_PATH_PREFIX } from '../utils/const';
import { evoke } from '../store/slices/snackBarSlice';
import { setComparativeEmail, setErrors } from '../store/slices/settingsSlice';
import { RootState } from '../store/store';
import { validateEmail } from '../utils/validators';
import { assertTrue } from '../utils/assert';
import z from 'zod';

const USER_ALREADY_EXISTS_ERROR = 'Es existiert bereits ein Konto mit dieser E-Mail-Adresse.';

const updateEmailResponseDataScheme = z.object({
  id: z.number(),
  email: z.string()
});

type UpdateEmailResponseData = z.infer<typeof updateEmailResponseDataScheme>;

const isUpdateEmailResponseData = (object: unknown): object is UpdateEmailResponseData => {
  return updateEmailResponseDataScheme.safeParse(object).success;
};

export function* updateEmailSaga(): SagaGenerator<void> {
  const { email, errors } = yield* select((state: RootState) => state.settings);

  yield* put(setErrors({ ...errors, email: undefined }));

  const emailError = validateEmail(email);

  if (emailError) {
    yield* put(setErrors({ ...errors, email: emailError }));

    return;
  }

  yield* call(
    fetchSagaFactory(
      { url: USER_URL_PATH_PREFIX, method: 'PUT', data: { email } },
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isUpdateEmailResponseData(response.data.user));

        yield* put(setComparativeEmail(response.data.user.email));
        yield* put(evoke({ severity: 'success', message: 'Deine E-Mail-Adresse wurde erfolgreich geändert.' }));
      },
      function* handleError(error: AxiosError) {
        if (error.response?.status === 409) {
          yield* put(setErrors({ ...errors, email: USER_ALREADY_EXISTS_ERROR }));
        }
      }
    )
  );
}
