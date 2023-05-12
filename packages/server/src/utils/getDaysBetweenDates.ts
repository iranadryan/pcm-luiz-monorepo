import moment from 'moment';

export function getDaysBetweenDates(
  startDate: Date,
  endDate: Date,
  dayNumber: number,
) {
  const result = [];
  const current = moment(startDate).add(1, 'd').toDate();
  current.setDate(current.getDate() + (dayNumber - current.getDay() + 7) % 7);
  while (current < endDate) {
    result.push(new Date(+current));
    current.setDate(current.getDate() + 7);
  }
  return result;
}
