import { call, put, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosResponse } from 'axios';
import { CATEGORIES_URL_PATH_PREFIX } from '../utils/const';
import { assertTrue } from '../utils/assert';
import { categoryScheme, setCategories } from '../store/slices/categoriesSlice';
import z from 'zod';

const categoriesResponseDataScheme = z.array(categoryScheme);

type CategoriesResponseData = z.infer<typeof categoriesResponseDataScheme>;

const isCategoriesResponseData = (object: unknown): object is CategoriesResponseData => {
  return categoriesResponseDataScheme.safeParse(object).success;
};

export function* loadCategoriesSaga(): SagaGenerator<void> {
  yield* call(
    fetchSagaFactory({ url: CATEGORIES_URL_PATH_PREFIX }, function* handleResponse(response: AxiosResponse) {
      assertTrue(isCategoriesResponseData(response.data));

      yield* put(setCategories(response.data));
    })
  );
}
