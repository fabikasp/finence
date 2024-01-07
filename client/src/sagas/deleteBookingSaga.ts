import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosResponse } from 'axios';
import { BOOKINGS_URL_PATH_PREFIX } from '../utils/const';
import { assertNonNullable, assertTrue } from '../utils/assert';
import { RootState } from '../store/store';
import { evoke } from '../store/slices/snackBarSlice';
import { isBooking, setBookings, setDeletedBooking } from '../store/slices/financesSlice';

export function* deleteBookingSaga(): SagaGenerator<void> {
  const { bookings, deletedBooking } = yield* select((state: RootState) => state.finances);
  assertNonNullable(deletedBooking);

  yield* call(
    fetchSagaFactory(
      { url: `${BOOKINGS_URL_PATH_PREFIX}${deletedBooking.id}`, method: 'DELETE' },
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isBooking(response.data.booking));

        const bookingType = deletedBooking.isIncome ? 'Einnahme' : 'Ausgabe';

        yield* put(setBookings(bookings.filter((booking) => booking.id !== response.data.booking.id)));
        yield* put(setDeletedBooking(undefined));
        yield* put(evoke({ severity: 'success', message: `Die ${bookingType} wurde erfolgreich gelöscht.` }));
      }
    )
  );
}
