import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosResponse } from 'axios';
import { BOOKINGS_URL_PATH_PREFIX } from '../utils/const';
import { assertNonNullable, assertTrue } from '../utils/assert';
import { RootState } from '../store/store';
import { isBooking, setBookings, setCreatedBooking } from '../store/slices/financesSlice';
import { PayloadAction } from '@reduxjs/toolkit';
import { CreateBookingPayload } from '../store/actions';
import { validateBookingAmount, validateBookingDate, validateBookingNote } from '../utils/validators';

export function* createBookingSaga(action: PayloadAction<CreateBookingPayload>): SagaGenerator<void> {
  const { bookings, createdBooking } = yield* select((state: RootState) => state.finances);
  assertNonNullable(createdBooking);

  yield* put(setCreatedBooking({ ...createdBooking, errors: undefined }));

  const dateError = validateBookingDate(createdBooking.date);
  const amountError = validateBookingAmount(createdBooking.amount);
  const noteError = validateBookingNote(createdBooking.note ?? '');

  if (dateError || amountError || noteError) {
    yield* put(
      setCreatedBooking({
        ...createdBooking,
        errors: { date: dateError, amount: amountError, note: noteError }
      })
    );

    return;
  }

  yield* call(
    fetchSagaFactory(
      {
        url: BOOKINGS_URL_PATH_PREFIX,
        method: 'POST',
        data: {
          ...createdBooking,
          amount: Number(createdBooking.amount)
        }
      },
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isBooking(response.data.booking));

        yield* put(setBookings([...bookings, response.data.booking]));
        yield* put(
          setCreatedBooking(
            action.payload.closeDialog
              ? undefined
              : { ...createdBooking, amount: '', category: undefined, note: undefined }
          )
        );
      }
    )
  );
}
