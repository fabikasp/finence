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

  yield* put(setViewedCategory({ ...viewedCategory, errors: undefined }));

  const nameError = validateCategoryName(viewedCategory.name);
  const descriptionError = validateCategoryDescription(viewedCategory.description ?? '');

  if (nameError || descriptionError) {
    yield* put(setViewedCategory({ ...viewedCategory, errors: { name: nameError, description: descriptionError } }));

    return;
  }

  yield* call(
    fetchSagaFactory(
      {
        url: `${CATEGORIES_URL_PATH_PREFIX}${viewedCategory.id}`,
        method: 'PUT',
        data: yield* call(buildRequestData)
      },
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isCategory(response.data.category));

        const updatedCategories = categories.map((category) => {
          if (category.id === response.data.category.id) {
            return response.data.category;
          }

          return category;
        });

        yield* put(setCategories(updatedCategories));
        yield* put(setViewedCategory(undefined));
      },
      function* handleError(error: AxiosError) {
        if (error.response?.status === 409) {
          yield* put(
            setViewedCategory({
              ...viewedCategory,
              errors: { name: CATEGORY_ALREADY_EXISTS_ERROR, description: undefined }
            })
          );
        }
      }
    )
  );
}

interface RequestData {
  name?: string;
  description?: string | null;
}

function* buildRequestData(): SagaGenerator<RequestData> {
  const { viewedCategory } = yield* select((state: RootState) => state.categories);
  assertNonNullable(viewedCategory);

  const result: RequestData = {};
  if (viewedCategory.name !== viewedCategory.comparativeName) {
    result.name = viewedCategory.name;
  }

  if (viewedCategory.description !== viewedCategory.comparativeDescription) {
    result.description = viewedCategory.description ?? null;
  }

  return result;
}
