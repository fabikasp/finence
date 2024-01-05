import moment, { Moment } from 'moment';

export function convertMomentToUnix(date: Moment): number {
  return date.unix();
}

export function convertUnixToMoment(timestamp: number): Moment {
  return moment.unix(timestamp);
}

export function datesAreEqual(date1: number, date2: number): boolean {
  const moment1 = convertUnixToMoment(date1);
  const moment2 = convertUnixToMoment(date2);

  return moment1.startOf('day').isSame(moment2.startOf('day'));
}
