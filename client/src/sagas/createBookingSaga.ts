import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosResponse } from 'axios';
import { BOOKINGS_URL_PATH_PREFIX } from '../utils/const';
import { assertNonNullable, assertTrue } from '../utils/assert';
import { RootState } from '../store/store';
import { isBooking, setBookings, setCreatedBooking } from '../store/slices/financesSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { CreateBookingPayload } from '../store/actions';

export function* createBookingSaga(action: PayloadAction<CreateBookingPayload>): SagaGenerator<void> {
  const { bookings, createdBooking } = yield* select((state: RootState) => state.finances);
  assertNonNullable(createdBooking);

  yield* call(
    fetchSagaFactory(
      {
        url: BOOKINGS_URL_PATH_PREFIX,
        method: 'POST',
        data: {} // TODO: Dates umwandeln etc.
      },
      function* handleResponse(response: AxiosResponse) {
        // TODO: Dates umwandeln
        assertTrue(isBooking(response.data));

        yield* put(setBookings([...bookings, response.data]));
        yield* put(
          setCreatedBooking(
            action.payload.closeDialog ? undefined : { ...createdBooking, amount: 0, category: '', note: undefined }
          )
        );
      }
    )
  );
}
