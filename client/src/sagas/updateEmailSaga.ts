import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosError } from 'axios';
import { LOGIN_ROUTE, USER_URL_PATH_PREFIX } from '../utils/const';
import { navigate } from '../store/slices/navigatorSlice';
import { evoke, evokeExpiredSessionError } from '../store/slices/snackBarSlice';
import { getDecodedJwt } from '../utils/helper';
import { setEmail, setErrors } from '../store/slices/accountManagementSlice';
import { RootState } from '../store/store';
import { validateEmail } from '../utils/validators';

const USER_ALREADY_EXISTS_ERROR = 'Es existiert bereits ein Konto mit dieser E-Mail-Adresse.';

export function* updateEmailSaga(): SagaGenerator<void> {
  const errors = yield* select((state: RootState) => state.accountManagement.errors);

  yield* put(setErrors({ ...errors, email: '' }));

  const { email } = yield* select((state: RootState) => state.accountManagement);
  const emailError = validateEmail(email);

  if (emailError) {
    yield* put(setErrors({ ...errors, email: emailError }));

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
      { url: `${USER_URL_PATH_PREFIX}/update/${decodedJwt.sub}`, method: 'PUT', data: { email } },
      function* handleResponse() {
        yield* put(setEmail(email));
        yield* put(evoke({ severity: 'success', message: 'Ihre E-Mail-Adresse wurde erfolgreich geändert.' }));
      },
      function* handleError(error: AxiosError) {
        if (error.response?.status === 409) {
          yield* put(setErrors({ ...errors, email: USER_ALREADY_EXISTS_ERROR }));
        }
      }
    )
  );
}
