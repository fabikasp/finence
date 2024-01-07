import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosError, AxiosResponse } from 'axios';
import { CATEGORIES_URL_PATH_PREFIX } from '../utils/const';
import { assertNonNullable, assertTrue } from '../utils/assert';
import { isCategory, setCategories, setCreatedCategory } from '../store/slices/categoriesSlice';
import { RootState } from '../store/store';
import { validateCategoryDescription, validateCategoryName } from '../utils/validators';
import { PayloadAction } from '@reduxjs/toolkit';
import { CreateCategoryPayload } from '../store/actions';

const CATEGORY_ALREADY_EXISTS_ERROR = 'Diese Kategorie existiert bereits.';

export function* createCategorySaga(action: PayloadAction<CreateCategoryPayload>): SagaGenerator<void> {
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
        data: createdCategory
      },
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isCategory(response.data.category));

        yield* put(setCategories([...categories, response.data.category]));
        yield* put(
          setCreatedCategory(
            action.payload.closeDialog ? undefined : { name: '', forIncome: createdCategory.forIncome }
          )
        );
      },
      function* handleError(error: AxiosError) {
        if (error.response?.status === 409) {
          yield* put(
            setCreatedCategory({
              ...createdCategory,
              errors: { name: CATEGORY_ALREADY_EXISTS_ERROR }
            })
          );
        }
      }
    )
  );
}
