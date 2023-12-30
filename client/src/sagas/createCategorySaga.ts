import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosError, AxiosResponse } from 'axios';
import { CATEGORIES_URL_PATH_PREFIX } from '../utils/const';
import { assertNonNullable, assertTrue } from '../utils/assert';
import { isCategory, setCategories, setCreatedCategory } from '../store/slices/categoriesSlice';
import { RootState } from '../store/store';
import { validateCategoryDescription, validateCategoryName } from '../utils/validators';

const CATEGORY_ALREADY_EXISTS_ERROR = 'Diese Kategorie existiert bereits.';

export function* createCategorySaga(): SagaGenerator<void> {
  const { categories, createdCategory } = yield* select((state: RootState) => state.categories);
  assertNonNullable(createdCategory);

  yield* put(setCreatedCategory({ ...createdCategory, errors: undefined }));

  const nameError = validateCategoryName(createdCategory.name);
  const descriptionError = validateCategoryDescription(createdCategory.description ?? '');

  if (nameError || descriptionError) {
    yield* put(setCreatedCategory({ ...createdCategory, errors: { name: nameError, description: descriptionError } }));

    return;
  }

  yield* call(
    fetchSagaFactory(
      {
        url: CATEGORIES_URL_PATH_PREFIX,
        method: 'POST',
        data: Object.fromEntries(
          Object.entries(createdCategory).filter((entry) => typeof entry[1] !== 'string' || entry[1] !== '')
        )
      },
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isCategory(response.data));

        yield* put(setCategories([...categories, response.data]));
        yield* put(setCreatedCategory(undefined));
      },
      function* handleError(error: AxiosError) {
        if (error.response?.status === 409) {
          yield* put(
            setCreatedCategory({
              ...createdCategory,
              errors: { name: CATEGORY_ALREADY_EXISTS_ERROR, description: undefined }
            })
          );
        }
      }
    )
  );
}
