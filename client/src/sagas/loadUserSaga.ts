import { call, put, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosResponse } from 'axios';
import { USER_URL_PATH_PREFIX } from '../utils/const';
import { assertTrue } from '../utils/assert';
import z from 'zod';
import { setComparativeEmail, setEmail } from '../store/slices/settingsSlice';

const userResponseDataScheme = z.object({
  id: z.number(),
  email: z.string()
});

type UserResponseData = z.infer<typeof userResponseDataScheme>;

const isUserResponseData = (object: unknown): object is UserResponseData => {
  return userResponseDataScheme.safeParse(object).success;
};

export function* loadUserSaga(): SagaGenerator<void> {
  yield* call(
    fetchSagaFactory({ url: USER_URL_PATH_PREFIX }, function* handleResponse(response: AxiosResponse) {
      const user = response.data.user;
      assertTrue(isUserResponseData(user));

      yield* put(setEmail(user.email));
      yield* put(setComparativeEmail(user.email));
    })
  );
}
