import { call, put, SagaGenerator } from 'typed-redux-saga';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ACCESS_TOKEN_KEY, LOGIN_ROUTE } from '../utils/const';
import { assertTrue } from '../utils/assert';
import { evoke, evokeDefault } from '../store/slices/snackBarSlice';
import { navigate } from '../store/slices/navigatorSlice';
import { set } from '../store/slices/globalProgressIndicatorSlice';

export function fetchSagaFactory(
  request: AxiosRequestConfig,
  successCallback: (response: AxiosResponse) => SagaGenerator<void>,
  errorCallback?: (error: AxiosError) => SagaGenerator<void>
): () => SagaGenerator<void> {
  return function* fetchSaga() {
    yield* put(set(true));

    try {
      const response = yield* call(axios.request<AxiosResponse>, {
        ...request,
        baseURL: process.env.SERVER_BASE_URL,
        headers: {
          ...request.headers,
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY) ?? ''}`
        }
      });

      if (response.status !== 200) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      yield* call(successCallback, response);
    } catch (error: unknown) {
      assertTrue(error instanceof AxiosError);

      const status = error.response?.status;
      if (status === 401 || status === 403) {
        yield* put(evoke({ severity: 'error', message: 'Ihre Sitzung ist abgelaufen.' }));
        yield* put(navigate(`/${LOGIN_ROUTE}`));
      } else if (status !== 404 && status !== 409) {
        yield* put(evokeDefault());
      }

      if (errorCallback) {
        yield* call(errorCallback, error);
      }
    } finally {
      yield* put(set(false));
    }
  };
}
