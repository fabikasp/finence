import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosResponse } from 'axios';
import { CATEGORIES_URL_PATH_PREFIX } from '../utils/const';
import { assertTrue } from '../utils/assert';
import { isCategory, setCategories } from '../store/slices/categoriesSlice';
import { RootState } from '../store/store';
import { PayloadAction } from '@reduxjs/toolkit';
import { evoke } from '../store/slices/snackBarSlice';

export function* deleteCategorySaga(action: PayloadAction<number>): SagaGenerator<void> {
  yield* call(
    fetchSagaFactory(
      { url: `${CATEGORIES_URL_PATH_PREFIX}${action.payload}`, method: 'DELETE' },
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isCategory(response.data));

        const { categories } = yield* select((state: RootState) => state.categories);

        yield* put(setCategories(categories.filter((category) => category.id !== response.data.id)));
        yield* put(evoke({ severity: 'success', message: 'Die Kategorie wurde erfolgreich gelöscht.' }));
      }
    )
  );
}
