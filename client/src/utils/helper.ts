import moment, { Moment } from 'moment';

export function convertMomentToUnix(date: Moment): number {
  return date.unix();
}

export function convertUnixToMoment(timestamp: number): Moment {
  return moment.unix(timestamp).startOf('day');
}

export function datesAreEqual(date1: number, date2: number): boolean {
  return convertUnixToMoment(date1).isSame(convertUnixToMoment(date2));
}
