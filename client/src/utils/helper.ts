import moment, { Moment } from 'moment';

export function convertMomentToUnix(date: Moment): number {
  return date.unix();
}

export function convertUnixToMoment(timestamp: number): Moment {
  return moment.unix(timestamp);
}
