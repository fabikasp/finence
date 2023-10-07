import { call, put, SagaGenerator } from 'typed-redux-saga';
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';
import { ACCESS_TOKEN_KEY, LOGIN_ROUTE } from '../utils/const';
import { assertTrue } from '../utils/assert';
import { evokeUnknownError } from '../store/slices/snackBarSlice';
import { navigate } from '../store/slices/navigatorSlice';
import { set } from '../store/slices/globalProgressIndicatorSlice';
import z from 'zod';

const responseWithAccessTokenScheme = z.object({
  accessToken: z.string()
});

type ResponseWithAccessToken = z.infer<typeof responseWithAccessTokenScheme>;

const isResponseWithAccessToken = (object: unknown): object is ResponseWithAccessToken => {
  return responseWithAccessTokenScheme.safeParse(object).success;
};

export function fetchSagaFactory(
  request: AxiosRequestConfig,
  successCallback?: (response: AxiosResponse) => SagaGenerator<void>,
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

      if (isResponseWithAccessToken(response.data)) {
        localStorage.setItem(ACCESS_TOKEN_KEY, response.data.accessToken);
      }

      if (successCallback) {
        yield* call(successCallback, response);
      }
    } catch (error: unknown) {
      assertTrue(error instanceof AxiosError);

      const status = error.response?.status;
      if (status === 401 || status === 403) {
        yield* put(navigate(`/${LOGIN_ROUTE}`));
      } else if (status !== 404 && status !== 409) {
        yield* put(evokeUnknownError());
      }

      if (errorCallback) {
        yield* call(errorCallback, error);
      }
    } finally {
      yield* put(set(false));
    }
  };
}
