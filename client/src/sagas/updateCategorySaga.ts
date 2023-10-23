import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosError, AxiosResponse } from 'axios';
import { CATEGORIES_URL_PATH_PREFIX } from '../utils/const';
import { assertNonNullable, assertTrue } from '../utils/assert';
import { isCategory, setCategories, setViewedCategory } from '../store/slices/categoriesSlice';
import { RootState } from '../store/store';
import { validateCategoryDescription, validateCategoryName } from '../utils/validators';

const CATEGORY_ALREADY_EXISTS_ERROR = 'Diese Kategorie existiert bereits.';

export function* updateCategorySaga(): SagaGenerator<void> {
  const { categories, viewedCategory } = yield* select((state: RootState) => state.categories);
  assertNonNullable(viewedCategory);

  yield* put(setViewedCategory({ ...viewedCategory, errors: { name: '', description: '' } }));

  const nameError = validateCategoryName(viewedCategory.name);
  const descriptionError = validateCategoryDescription(viewedCategory.description);

  if (nameError || descriptionError) {
    yield* put(setViewedCategory({ ...viewedCategory, errors: { name: nameError, description: descriptionError } }));

    return;
  }

  yield* call(
    fetchSagaFactory(
      {
        url: `${CATEGORIES_URL_PATH_PREFIX}${viewedCategory.id}`,
        method: 'PUT',
        data: Object.fromEntries(
          Object.entries(viewedCategory).filter((entry) => typeof entry[1] !== 'string' || entry[1] !== '')
        )
      },
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isCategory(response.data));

        const updatedCategories = categories.map((category) => {
          if (category.id === response.data.id) {
            return response.data;
          }

          return category;
        });

        yield* put(setCategories(updatedCategories));
        yield* put(setViewedCategory(undefined));
      },
      function* handleError(error: AxiosError) {
        if (error.response?.status === 409) {
          yield* put(
            setViewedCategory({ ...viewedCategory, errors: { name: CATEGORY_ALREADY_EXISTS_ERROR, description: '' } })
          );
        }
      }
    )
  );
}
