import { differenceInBusinessDays, isWeekend } from 'date-fns';
import moment from 'moment';
import { formatHours } from './formatHours';
import { getDaysBetweenDates } from './getDaysBetweenDates';

type serviceType = {
  number: number;
  name: string;
  startdate: Date;
  enddate: Date;
}

export function getServiceHoursByMechanic(services: serviceType[]) {
  const servicesHours: {
    mechanic: string;
    hours: number;
  }[] = [];

  for (const service of services) {
    const startDate = moment(service.startdate).subtract(3, 'h');
    const endDate = moment(service.enddate).subtract(3, 'h');

    if (startDate.isSame(endDate, 'day')) {
      const lunchStart = startDate
        .clone()
        .startOf('day')
        .subtract(3, 'h')
        .add(12, 'h');
      const lunchEnd = startDate
        .clone()
        .startOf('day')
        .subtract(3, 'h')
        .add(13.5, 'h');
      let serviceHours = Number(
        (endDate.diff(startDate, 'm') / 60).toFixed(2)
      );

      if (service.number === 5528) {
        console.log({
          number: service.number,
          startDate,
          endDate,
          lunchStart,
          lunchEnd,
          hadLunch: startDate.isBefore(lunchStart) && endDate.isAfter(lunchEnd)
        });
      }

      if (startDate.isBefore(lunchStart) && endDate.isAfter(lunchEnd)) {
        serviceHours -= 1.5;
      }

      servicesHours.push({
        mechanic: service.name,
        hours: serviceHours,
      });
    } else {
      const days = differenceInBusinessDays(
        endDate.toDate(),
        startDate.clone().add(1, 'd').toDate()
      );
      const firstDayEndTime = startDate
        .clone()
        .startOf('day')
        .subtract(3, 'h')
        .add(isWeekend(startDate.toDate()) ? 12 : 17.5, 'h');
      const firstDayLunchStart = startDate
        .clone()
        .startOf('day')
        .subtract(3, 'h')
        .add(12, 'h');
      const firstDayLunchEnd = startDate
        .clone()
        .startOf('day')
        .subtract(3, 'h')
        .add(13.5, 'h');
      const lastDayStartTime = endDate
        .clone()
        .startOf('day')
        .subtract(3, 'h')
        .add(8, 'h');
      const lastDayLunchStart = endDate
        .clone()
        .startOf('day')
        .subtract(3, 'h')
        .add(12, 'h');
      const lastDayLunchEnd = endDate
        .clone()
        .startOf('day')
        .subtract(3, 'h')
        .add(13.5, 'h');
      const saturdays = getDaysBetweenDates(
        startDate.toDate(),
        endDate.toDate(),
        6
      ).length;
      const saturdaysHours = saturdays * 4;
      const daysHours = days * 8;
      let firstDayHours = Number(
        (firstDayEndTime.diff(startDate, 'm') / 60).toFixed(2)
      );
      let lastDayHours = Number(
        (endDate.diff(lastDayStartTime, 'm') / 60).toFixed(2)
      );

      if (
        startDate.isBefore(firstDayLunchStart) &&
        firstDayEndTime.isAfter(firstDayLunchEnd)
      ) {
        firstDayHours -= 1.5;
      }

      if (
        lastDayStartTime.isBefore(lastDayLunchStart) &&
        endDate.isAfter(lastDayLunchEnd)
      ) {
        lastDayHours -= 1.5;
      }

      const serviceHours =
        firstDayHours + daysHours + saturdaysHours + lastDayHours;

      servicesHours.push({
        mechanic: service.name,
        hours: serviceHours,
      });
    }
  }

  const servicesHoursByMechanic = servicesHours.reduce(
    (acc, curr) => {
      const mechanicIndex = acc.findIndex(
        (item) => item.mechanic === curr.mechanic
      );

      if (mechanicIndex !== -1) {
        acc[mechanicIndex].hours += curr.hours;
      } else {
        acc.push({
          ...curr,
          hoursFormatted: '',
        });
      }

      return acc;
    },
    [] as {
      mechanic: string;
      hours: number;
      hoursFormatted: string;
    }[]
  );

  servicesHoursByMechanic.forEach((item, index) => {
    servicesHoursByMechanic[index].hoursFormatted = formatHours(item.hours);
  });

  servicesHoursByMechanic.sort((a, b) => b.hours - a.hours);

  return servicesHoursByMechanic;
}
