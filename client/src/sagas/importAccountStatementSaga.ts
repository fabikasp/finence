import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { IMPORT_ACCOUNT_STATEMENT_URL_PATH_PREFIX } from '../utils/const';
import { assertNonNullable } from '../utils/assert';
import { RootState } from '../store/store';
import { setCurrentStep } from '../store/slices/accountStatementImportSlice';

export function* importAccountStatementSaga(): SagaGenerator<void> {
  const { currentStep, csvFile } = yield* select((state: RootState) => state.accountStatementImport);
  assertNonNullable(csvFile);

  yield* put(setCurrentStep(currentStep + 1));
  yield* call(
    fetchSagaFactory(
      {
        url: IMPORT_ACCOUNT_STATEMENT_URL_PATH_PREFIX,
        method: 'POST',
        data: { csv: csvFile.content }
      },
      function* handleResponse() {
        // TODO: Returnte Buchungen in State speisen
      },
      function* handleError() {
        // TODO: Errors handlen
      }
    )
  );
}
