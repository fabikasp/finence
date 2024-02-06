import { call, SagaGenerator } from 'typed-redux-saga';
import { fetchSagaFactory } from './fetchSaga';
import { BOOKINGS_URL_PATH_PREFIX } from '../utils/const';
import { PayloadAction } from '@reduxjs/toolkit';
import { ImportBookingImagePayload } from '../store/actions';

export function* importBookingImageSaga(action: PayloadAction<ImportBookingImagePayload>): SagaGenerator<void> {
  const response = yield* call(fetch, action.payload.imageUrl);
  const data = new FormData();
  data.append('image', yield* call([response, 'blob']));

  URL.revokeObjectURL(action.payload.imageUrl);

  yield* call(
    fetchSagaFactory(
      {
        url: `${BOOKINGS_URL_PATH_PREFIX}import-booking-image`,
        method: 'POST',
        data
      },
      function* handleResponse() {
        alert('TEST');
      }
    )
  );
}
