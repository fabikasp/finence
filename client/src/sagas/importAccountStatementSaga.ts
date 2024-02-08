import { call, select, SagaGenerator, put } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { assertNonNullable, assertTrue } from '../utils/assert';
import { RootState } from '../store/store';
import { AxiosError, AxiosResponse } from 'axios';
import { bookingScheme, setBookings } from '../store/slices/financesSlice';
import { setCurrentStep, setErrors, toggleOpenDialog } from '../store/slices/accountStatementImportSlice';
import { BOOKINGS_URL_PATH_PREFIX } from '../utils/const';
import { evoke } from '../store/slices/snackBarSlice';
import z from 'zod';

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
        url: `${BOOKINGS_URL_PATH_PREFIX}import-account-statement`,
        method: 'POST',
        data: { csvContent: csvFile.content }
      },
      function* handleResponse(response: AxiosResponse) {
        const newBookings = response.data.bookings;
        assertTrue(isBookingsResponseData(newBookings));

        const responseIsEmpty = Object.keys(newBookings).length === 0;

        yield* put(
          evoke({
            severity: responseIsEmpty ? 'warning' : 'success',
            message: responseIsEmpty
              ? 'Es wurden keine Buchungen gefunden.'
              : `Es wurden ${newBookings.length} Buchungen importiert.`
          })
        );
        yield* put(setBookings([...bookings, ...newBookings]));
        yield* put(toggleOpenDialog());
      },
      function* handleError(error: AxiosError) {
        if (error.response?.status === 422) {
          yield* put(setErrors({ csvFile: 'Die Datei ist nicht gültig.' }));
          yield* put(setCurrentStep(0));
        }
      }
    )
  );
}
