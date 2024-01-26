import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { COLUMN_MAPPING_URL_PATH_PREFIX } from '../utils/const';
import { assertNonNullable, assertTrue } from '../utils/assert';
import { RootState } from '../store/store';
import { validateColumnLabel } from '../utils/validators';
import {
  isColumnMapping,
  setColumnMapping,
  setCurrentStep,
  setErrors
} from '../store/slices/accountStatementImportSlice';
import { AxiosResponse } from 'axios';

export function* persistColumnMappingSaga(): SagaGenerator<void> {
  const { currentStep, csvFile, columnMapping } = yield* select((state: RootState) => state.accountStatementImport);
  assertNonNullable(csvFile);

  yield* put(setErrors(undefined));

  const dateColumnLabelError = validateColumnLabel(columnMapping.dateColumnLabel, csvFile.content);
  const amountColumnLabelError = validateColumnLabel(columnMapping.amountColumnLabel, csvFile.content);

  if (dateColumnLabelError || amountColumnLabelError) {
    yield* put(setErrors({ dateColumnLabel: dateColumnLabelError, amountColumnLabel: amountColumnLabelError }));

    return;
  }

  const requestData = yield* call(buildRequestData);

  if (Object.keys(requestData).length > 0) {
    yield* call(
      fetchSagaFactory(
        {
          url: `${COLUMN_MAPPING_URL_PATH_PREFIX}${columnMapping.id ?? ''}`,
          method: columnMapping.id ? 'PUT' : 'POST',
          data: yield* call(buildRequestData)
        },
        function* handleResponse(response: AxiosResponse) {
          const newColumnMapping = response.data.columnMapping;
          assertTrue(isColumnMapping(newColumnMapping));

          yield* put(
            setColumnMapping({
              ...newColumnMapping,
              comparativeDateColumnLabel: newColumnMapping.dateColumnLabel,
              comparativeAmountColumnLabel: newColumnMapping.amountColumnLabel
            })
          );
          yield* put(setCurrentStep(currentStep + 1));
        }
      )
    );
  } else {
    yield* put(setCurrentStep(currentStep + 1));
  }
}

interface RequestData {
  dateColumnLabel?: string;
  amountColumnLabel?: string;
}

function* buildRequestData(): SagaGenerator<RequestData> {
  const { columnMapping } = yield* select((state: RootState) => state.accountStatementImport);

  const result: RequestData = {};
  if (columnMapping.dateColumnLabel !== columnMapping.comparativeDateColumnLabel) {
    result.dateColumnLabel = columnMapping.dateColumnLabel;
  }

  if (columnMapping.amountColumnLabel !== columnMapping.comparativeAmountColumnLabel) {
    result.amountColumnLabel = columnMapping.amountColumnLabel;
  }

  return result;
}
