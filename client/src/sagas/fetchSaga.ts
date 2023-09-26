import { call, put, SagaGenerator } from 'typed-redux-saga';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ACCESS_TOKEN_KEY, USER_URL_PATH_PREFIX } from '../utils/const';
import { assertTrue } from '../utils/assert';
import { evokeDefault } from '../store/slices/snackBarSlice';

function isLoginUrl(url: string): boolean {
  return url === `${USER_URL_PATH_PREFIX}/login`;
}

export function fetchSagaFactory(
  request: AxiosRequestConfig,
  successCallback: (response: AxiosResponse) => SagaGenerator<void>,
  errorCallback: (error: AxiosError) => SagaGenerator<void>
): () => SagaGenerator<void> {
  return function* fetchSaga() {
    try {
      const response = yield* call(axios.request<AxiosResponse>, {
        ...request,
        baseURL: process.env.SERVER_BASE_URL,
        headers: {
          ...request.headers,
          Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN_KEY)}`
        }
      });

      if (response.status !== 200) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      yield* call(successCallback, response);
    } catch (error: unknown) {
      assertTrue(error instanceof AxiosError);

      if (error.response?.status === 401 || error.response?.status === 403) {
        if (isLoginUrl(request.url!)) {
          return;
        }

        // TODO: Zu Login weiterleiten
      } else {
        yield* put(evokeDefault());
      }

      yield* call(errorCallback, error);
    }
  };
}
