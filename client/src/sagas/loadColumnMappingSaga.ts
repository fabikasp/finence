import { call, put, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosResponse } from 'axios';
import { COLUMN_MAPPING_URL_PATH_PREFIX } from '../utils/const';
import { assertTrue } from '../utils/assert';
import { isColumnMapping, setColumnMapping } from '../store/slices/accountStatementImportSlice';

export function* loadColumnMappingSaga(): SagaGenerator<void> {
  yield* call(
    fetchSagaFactory({ url: COLUMN_MAPPING_URL_PATH_PREFIX }, function* handleResponse(response: AxiosResponse) {
      const columnMapping = response.data.columnMapping;
      assertTrue(isColumnMapping(columnMapping));

      yield* put(
        setColumnMapping({
          ...columnMapping,
          comparativeDateColumnLabel: columnMapping.dateColumnLabel,
          comparativeAmountColumnLabel: columnMapping.amountColumnLabel
        })
      );
    })
  );
}
