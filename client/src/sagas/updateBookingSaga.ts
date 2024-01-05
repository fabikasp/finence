import { call, put, select, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { AxiosResponse } from 'axios';
import { BOOKINGS_URL_PATH_PREFIX } from '../utils/const';
import { assertNonNullable, assertTrue } from '../utils/assert';
import { RootState } from '../store/store';
import {
  validateBookingAmount,
  validateBookingCategory,
  validateBookingDate,
  validateBookingNote
} from '../utils/validators';
import { isBooking, setBookings, setUpdatedBooking } from '../store/slices/financesSlice';
import { datesAreEqual } from '../utils/helper';

export function* updateBookingSaga(): SagaGenerator<void> {
  const { bookings, updatedBooking } = yield* select((state: RootState) => state.finances);
  assertNonNullable(updatedBooking);

  yield* put(setUpdatedBooking({ ...updatedBooking, errors: undefined }));

  const dateError = validateBookingDate(updatedBooking.date);
  const amountError = validateBookingAmount(updatedBooking.amount);
  const categoryError = validateBookingCategory(updatedBooking.category);
  const noteError = validateBookingNote(updatedBooking.note ?? '');

  if (dateError || amountError || categoryError || noteError) {
    yield* put(
      setUpdatedBooking({
        ...updatedBooking,
        errors: { date: dateError, amount: amountError, category: categoryError, note: noteError }
      })
    );

    return;
  }

  yield* call(
    fetchSagaFactory(
      {
        url: `${BOOKINGS_URL_PATH_PREFIX}${updatedBooking.id}`,
        method: 'PUT',
        data: yield* call(buildRequestData)
      },
      function* handleResponse(response: AxiosResponse) {
        assertTrue(isBooking(response.data));

        const updatedBookings = bookings.map((booking) => {
          if (booking.id === response.data.id) {
            return response.data;
          }

          return booking;
        });

        yield* put(setBookings(updatedBookings));
        yield* put(setUpdatedBooking(undefined));
      }
    )
  );
}

interface RequestData {
  date?: number;
  amount?: number;
  category?: string;
  note?: string;
}

function* buildRequestData(): SagaGenerator<RequestData> {
  const { updatedBooking } = yield* select((state: RootState) => state.finances);
  assertNonNullable(updatedBooking?.date);

  const result: RequestData = {};
  if (!datesAreEqual(updatedBooking.date, updatedBooking.comparativeDate)) {
    result.date = updatedBooking.date;
  }

  if (updatedBooking.amount !== updatedBooking.comparativeAmount) {
    result.amount = +Number(updatedBooking.amount).toFixed(2);
  }

  if (updatedBooking.category !== updatedBooking.comparativeCategory) {
    result.category = updatedBooking.category;
  }

  if (updatedBooking.note !== updatedBooking.comparativeNote) {
    result.note = updatedBooking.note;
  }

  console.warn(result);
  return result;
}
