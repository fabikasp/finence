import { call, select, SagaGenerator, put } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { IMPORT_ACCOUNT_STATEMENT_URL_PATH_PREFIX } from '../utils/const';
import { assertNonNullable, assertTrue } from '../utils/assert';
import { RootState } from '../store/store';
import { AxiosResponse } from 'axios';
import { bookingScheme, setBookings } from '../store/slices/financesSlice';
import z from 'zod';
import { toggleOpenDialog } from '../store/slices/accountStatementImportSlice';

const bookingsResponseDataScheme = z.array(bookingScheme);

type BookingsResponseData = z.infer<typeof bookingsResponseDataScheme>;

const isBookingsResponseData = (object: unknown): object is BookingsResponseData => {
  return bookingsResponseDataScheme.safeParse(object).success;
};

export function* importAccountStatementSaga(): SagaGenerator<void> {
  const { bookings } = yield* select((state: RootState) => state.finances);
  const { csvFile } = yield* select((state: RootState) => state.accountStatementImport);
  assertNonNullable(csvFile);

  yield* call(
    fetchSagaFactory(
      {
        url: IMPORT_ACCOUNT_STATEMENT_URL_PATH_PREFIX,
        method: 'POST',
        data: { csv: csvFile.content }
      },
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isBookingsResponseData(response.data.bookings));

        yield* put(setBookings({ ...bookings, ...response.data.bookings }));
        yield* put(toggleOpenDialog());
      },
      function* handleError() {
        // TODO: Errors handlen
      }
    )
  );
}
