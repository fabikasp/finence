import { call, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './factory';
import { AxiosResponse } from 'axios';

export function* loginSaga(): SagaGenerator<void> {
  yield* call(
    fetchSagaFactory(
      { url: '/users', method: 'GET' },
      function* handleResponse(response: AxiosResponse) {
        // TODO: Weiterleitung zur zuvor angefragten URL bzw. Dashboard
        yield* call(console.warn, response);
      },
      function* handleError(error: unknown) {
        // TODO: Login Error setzen
        yield* call(console.warn, error);
      }
    )
  );
}
