import { call, put, SagaGenerator, select } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { BOOKINGS_URL_PATH_PREFIX } from '../utils/const';
import { PayloadAction } from '@reduxjs/toolkit';
import { ImportBookingImagePayload } from '../store/actions';
import { AxiosError, AxiosResponse } from 'axios';
import { assertNonNullable, assertTrue } from '../utils/assert';
import { setCreatedBooking, setUpdatedBooking } from '../store/slices/financesSlice';
import { RootState } from '../store/store';
import { evoke } from '../store/slices/snackBarSlice';
import { validateBookingImage } from '../utils/validators';
import z from 'zod';

const importBookingImageResponseDataScheme = z.object({
  date: z.number().optional(),
  amount: z.number().optional(),
  isIncome: z.boolean().optional(),
  category: z.string().optional()
});

type ImportBookingImageResponseData = z.infer<typeof importBookingImageResponseDataScheme>;

const isImportBookingImageResponseData = (object: unknown): object is ImportBookingImageResponseData => {
  return importBookingImageResponseDataScheme.safeParse(object).success;
};

export function* importBookingImageSaga(action: PayloadAction<ImportBookingImagePayload>): SagaGenerator<void> {
  const { mode, imageUrl } = action.payload;

  const response = yield* call(fetch, imageUrl);
  const imageFile = yield* call([response, 'blob']);

  URL.revokeObjectURL(imageUrl);

  const error = validateBookingImage(imageFile);
  if (error) {
    yield* put(evoke({ severity: 'error', message: error }));

    return;
  }

  const data = new FormData();
  data.append('image', imageFile);

  yield* call(
    fetchSagaFactory(
      {
        url: `${BOOKINGS_URL_PATH_PREFIX}import-booking-image`,
        method: 'POST',
        data
      },
      function* handleResponse(response: AxiosResponse) {
        const bookingData = response.data.bookingData;
        assertTrue(isImportBookingImageResponseData(bookingData));

        if (Object.keys(bookingData).length === 0) {
          yield* put(evoke({ severity: 'warning', message: 'Es wurden keine Buchungsinformationen gefunden.' }));
          return;
        }

        if (mode === 'create') {
          const { createdBooking } = yield* select((state: RootState) => state.finances);
          assertNonNullable(createdBooking);

          yield* put(
            setCreatedBooking({
              ...createdBooking,
              date: bookingData.date ?? createdBooking.date,
              amount: bookingData.amount ? bookingData.amount.toString() : createdBooking.amount,
              isIncome: bookingData.isIncome ?? createdBooking.isIncome,
              category: bookingData.category ?? createdBooking.category
            })
          );
        } else {
          const { updatedBooking } = yield* select((state: RootState) => state.finances);
          assertNonNullable(updatedBooking);

          yield* put(
            setUpdatedBooking({
              ...updatedBooking,
              date: bookingData.date ?? updatedBooking.date,
              amount: bookingData.amount ? bookingData.amount.toString() : updatedBooking.amount,
              isIncome: bookingData.isIncome ?? updatedBooking.isIncome,
              category: bookingData.category ?? updatedBooking.category
            })
          );
        }
      },
      function* handleError(error: AxiosError) {
        if (error.response?.status === 422) {
          yield* put(evoke({ severity: 'error', message: 'Die Datei konnte nicht verarbeitet werden.' }));
        }
      }
    )
  );
}
