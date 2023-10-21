import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosResponse } from 'axios';
import { CATEGORIES_URL_PATH_PREFIX } from '../utils/const';
import { assertNonNullable, assertTrue } from '../utils/assert';
import { isCategory, setCategories, setDeletedCategory } from '../store/slices/categoriesSlice';
import { RootState } from '../store/store';
import { evoke } from '../store/slices/snackBarSlice';

export function* deleteCategorySaga(): SagaGenerator<void> {
  const { categories, deletedCategory } = yield* select((state: RootState) => state.categories);
  assertNonNullable(deletedCategory);

  yield* call(
    fetchSagaFactory(
      { url: `${CATEGORIES_URL_PATH_PREFIX}${deletedCategory.id}`, method: 'DELETE' },
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isCategory(response.data));

        yield* put(setCategories(categories.filter((category) => category.id !== response.data.id)));
        yield* put(setDeletedCategory(undefined));
        yield* put(evoke({ severity: 'success', message: 'Die Kategorie wurde erfolgreich gelöscht.' }));
      }
    )
  );
}
