import { call, SagaGenerator } from 'typed-redux-saga';
import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';

export function fetchSagaFactory(
  request: AxiosRequestConfig,
  successCallback: (response: AxiosResponse) => SagaGenerator<void>,
  errorCallback: (exception: unknown) => SagaGenerator<void>
): () => SagaGenerator<void> {
  return function* fetchSaga() {
    try {
      const response = yield* call(axios.request<AxiosResponse>, {
        ...request,
        baseURL: ''
      });

      if (response.status !== 200) {
        throw new Error(`${response.status}: ${response.statusText}`);
      }

      yield* call(successCallback, response);
    } catch (error) {
      yield* call(errorCallback, error);
    }
  };
}
