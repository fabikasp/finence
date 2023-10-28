import moment from 'moment';
import 'moment/locale/de';

moment.locale('de');
const now = new Date();

export const years = Array.from({ length: 51 }, (_, i) => (now.getFullYear() - i).toString());

export const months = moment.months();

export const days = (year: string, month: string) => {
  const countDays = moment(year + '-' + moment().month(month).format('M'), 'YYYY-MM').daysInMonth();

  return Array.from({ length: countDays }, (_, i) => (++i).toString());
};
