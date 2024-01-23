import moment, { Moment } from 'moment';
import 'moment/locale/de';
import { CustomInterval, NativeInterval } from '../store/slices/intervalSelectionSlice';

export function convertMomentToUnix(date: Moment): number {
  return date.unix();
}

export function convertUnixToMoment(timestamp: number): Moment {
  return moment.unix(timestamp).startOf('day');
}

export function createMoment(year: number, monthShortcut?: string, day?: number): Moment {
  return moment({
    year,
    ...(monthShortcut && { month: moment.monthsShort().indexOf(monthShortcut) }),
    ...(day && { day })
  });
}

export function datesAreEqual(date1: number, date2: number): boolean {
  return convertUnixToMoment(date1).isSame(convertUnixToMoment(date2));
}

export function dateLiesInInterval(
  date: number,
  customIntervalEnabled: boolean,
  nativeInterval: NativeInterval,
  customInterval: CustomInterval
): boolean {
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
    result &&= moment.monthsShort()[bookingDate.month()] === nativeInterval.month;
  }

  if (nativeInterval.day) {
    result &&= bookingDate.date() === Number(nativeInterval.day);
  }

  return result;
}

export function darkenColorByFactor(hexCode: string, factor: number): string {
  let red = parseInt(hexCode.slice(1, 3), 16);
  let green = parseInt(hexCode.slice(3, 5), 16);
  let blue = parseInt(hexCode.slice(5, 7), 16);
  factor = Math.max(0, Math.min(factor, 1));

  red = Math.round(red * (1 - factor));
  green = Math.round(green * (1 - factor));
  blue = Math.round(blue * (1 - factor));

  return `#${((red << 16) | (green << 8) | blue).toString(16).padStart(6, '0')}`;
}
