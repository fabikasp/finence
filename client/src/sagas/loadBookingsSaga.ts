import { call, put, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosResponse } from 'axios';
import { BOOKINGS_URL_PATH_PREFIX } from '../utils/const';
import { assertTrue } from '../utils/assert';
import { bookingScheme, setBookings } from '../store/slices/financesSlice';
import z from 'zod';

const bookingsResponseDataScheme = z.array(bookingScheme);

type BookingsResponseData = z.infer<typeof bookingsResponseDataScheme>;

const isBookingsResponseData = (object: unknown): object is BookingsResponseData => {
  return bookingsResponseDataScheme.safeParse(object).success;
};

export function* loadBookingsSaga(): SagaGenerator<void> {
  yield* call(
    fetchSagaFactory({ url: BOOKINGS_URL_PATH_PREFIX }, function* handleResponse(response: AxiosResponse) {
      assertTrue(isBookingsResponseData(response.data.bookings));

      yield* put(setBookings(response.data.bookings));
    })
  );
}
