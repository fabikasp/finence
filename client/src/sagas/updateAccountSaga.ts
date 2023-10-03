import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosError } from 'axios';
import { LOGIN_ROUTE, USER_URL_PATH_PREFIX } from '../utils/const';
import { PayloadAction } from '@reduxjs/toolkit';
import { navigate } from '../store/slices/navigatorSlice';
import { evoke } from '../store/slices/snackBarSlice';
import { UpdateAccountPayload } from '../store/actions';
import { getDecodedJwt } from '../utils/helper';
import { setErrors } from '../store/slices/accountManagementSlice';
import { RootState } from '../store/store';

const USER_ALREADY_EXISTS_ERROR = 'Es existiert bereits ein Konto mit dieser E-Mail-Adresse.';

export function* updateAccountSaga(action: PayloadAction<UpdateAccountPayload>): SagaGenerator<void> {
  if (!action.payload.email && !action.payload.password) {
    return;
  }

  const decodedJwt = getDecodedJwt();
  if (!decodedJwt) {
    yield* put(navigate(`/${LOGIN_ROUTE}`));

    return;
  }

  const errors = yield* select((state: RootState) => state.accountManagement.errors);

  yield* call(
    fetchSagaFactory(
      { url: `${USER_URL_PATH_PREFIX}/update/${decodedJwt.sub}`, method: 'PUT', data: action.payload },
      function* handleResponse() {
        // TODO: Setzen der Email nach Login / Registrierung einbauen und bei erstem Rendering in Input setzen
        // TODO: Hier Email neu setzen
        yield* put(evoke({ severity: 'success', message: 'E-Mail-Adresse erfolgreich geändert.' }));
      },
      function* handleError(error: AxiosError) {
        if (error.response?.status === 409) {
          yield* put(setErrors({ ...errors, email: USER_ALREADY_EXISTS_ERROR }));
        }
      },
      true
    )
  );
}
