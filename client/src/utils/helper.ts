import moment, { Moment } from 'moment';
import { Booking } from '../store/slices/financesSlice';
import { CustomInterval, NativeInterval } from '../store/slices/intervalSelectionSlice';

export function convertMomentToUnix(date: Moment): number {
  return date.unix();
}

export function convertUnixToMoment(timestamp: number): Moment {
  return moment.unix(timestamp).startOf('day');
}

export function datesAreEqual(date1: number, date2: number): boolean {
  return convertUnixToMoment(date1).isSame(convertUnixToMoment(date2));
}

export function dateLiesInInterval(
  date: number,
  customIntervalEnabled: boolean,
  nativeInterval: NativeInterval,
  customInterval: CustomInterval
) {
  const months = moment.monthsShort();
  const bookingDate = convertUnixToMoment(date);

  if (customIntervalEnabled) {
    const startDate = customInterval.startDate ? convertUnixToMoment(customInterval.startDate) : null;
    const endDate = customInterval.endDate ? convertUnixToMoment(customInterval.endDate) : null;

    let result = true;
    if (startDate !== null) {
      result = bookingDate.isSameOrAfter(startDate);
    }

    if (endDate !== null) {
      result &&= bookingDate.isSameOrBefore(endDate);
    }

    return result;
  }

  let result = true;
  if (nativeInterval.year) {
    result = bookingDate.year() === Number(nativeInterval.year);
  }

  if (nativeInterval.month) {
    result &&= months[bookingDate.month()] === nativeInterval.month;
  }

  if (nativeInterval.day) {
    result &&= bookingDate.date() === Number(nativeInterval.day);
  }

  return result;
}
