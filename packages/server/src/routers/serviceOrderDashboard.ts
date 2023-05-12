import moment from 'moment';
import {
  eachMonthOfInterval,
  differenceInBusinessDays,
  isWeekend,
} from 'date-fns';
import { prisma } from '../lib/prisma';
import { publicProcedure, router } from '../lib/trpc';
import { firstLetterUppercase } from '../utils/firstLetterUppercase';
import { getDaysBetweenDates } from '../utils/getDaysBetweenDates';
import { formatHours } from '../utils/formatHours';
import { formatDays } from '../utils/formatDays';

export const serviceOrderDashboardRouter = router({
  openClosedTotal: publicProcedure.query(async () => {
    const openClosedTotal = await prisma.serviceOrder.groupBy({
      by: ['status'],
      _count: {
        _all: true,
      },
      orderBy: {
        status: 'asc',
      },
    });

    return {
      openTotal: openClosedTotal.find((item) => item.status === 'OPEN')?._count._all || 0,
      closedTotal: openClosedTotal.find((item) => item.status === 'CLOSED')?._count._all || 0,
    };
  }),
  openClosedTotalLastThreeMonths: publicProcedure.query(async () => {
    const startDate = moment().subtract(2, 'months').startOf('month').toDate();
    const months = eachMonthOfInterval({
      start: startDate,
      end: moment().toDate(),
    });
    const openTotalLastThreeMonths = await prisma.$queryRaw<
      Array<{
        total: number;
        month: number;
      }>
    >`
      select
        count(service_orders.id) as total,
        extract(month from service_orders."startDate") as month
      from service_orders
      where service_orders.status = 'OPEN'
      and service_orders."startDate" >= ${startDate}
      group by month
      order by month
    `;
    const closedTotalLastThreeMonths = await prisma.$queryRaw<
      Array<{
        total: number;
        month: number;
      }>
    >`
      select
        count(service_orders.id) as total,
        extract(month from service_orders."startDate") as month
      from service_orders
      where service_orders.status = 'CLOSED'
      and service_orders."startDate" >= ${startDate}
      group by month
      order by month
    `;

    const parsedData = months.map((date) => ({
      month: firstLetterUppercase(
        moment(date).locale('pt-BR').format('MMM. [de] YYYY')
      ),
      totalOpen:
        Number (openTotalLastThreeMonths.find((item) => {
          const monthNumber = moment(date).month();

          if (monthNumber === item.month - 1) {
            return true;
          }

          return false;
        })?.total || 0),
      totalClosed:
        Number (closedTotalLastThreeMonths.find((item) => {
          const monthNumber = moment(date).month();

          if (monthNumber === item.month - 1) {
            return true;
          }

          return false;
        })?.total || 0),
    }));

    return parsedData;
  }),
  totalByService: publicProcedure.query(async () => {
    const totalByService = await prisma.$queryRaw<
      Array<{
        total: number;
        service: string;
      }>
    >`
      select
        count(sos.id) as total,
        s."name" as service
      from service_orders_services sos
      left join services s on s.id = sos."serviceId"
      group by service
      order by total desc
    `;

    return totalByService.map((item) => ({
      service: item.service,
      total: Number(item.total)
    }));
  }),
  totalByDriver: publicProcedure.query(async () => {
    const totalByDriver = await prisma.$queryRaw<
      Array<{
        total: number;
        driver: string;
      }>
    >`
      select
        count(so.id) as total,
        p."name" as driver
      from service_orders so
      left join  people p on p.id = so."driverId"
      group by driver
      order by total desc
    `;

    return totalByDriver;
  }),
  totalByMechanic: publicProcedure.query(async () => {
    const totalByMechanic = await prisma.$queryRaw<
      Array<{
        total: number;
        mechanic: string;
      }>
    >`
      select
        count(sos.id) as total,
        p."name" as mechanic
      from service_orders_services sos
      left join  people p on p.id = sos."executorId"
      group by mechanic
      order by total desc
    `;

    const motoristaIndex = totalByMechanic.findIndex(
      (item) => item.mechanic === 'MOTORISTA'
    );

    if (motoristaIndex !== -1) {
      totalByMechanic.splice(motoristaIndex, 1);
    }

    return totalByMechanic;
  }),
  totalServiceHoursByMechanic: publicProcedure.query(async () => {
    const services = await prisma.$queryRaw<
      Array<{
        name: string;
        startdate: Date;
        enddate: Date;
      }>
    >`
      select
        p."name",
        so."startDate" + sos."startTime" as startDate,
	      sos."endDate" + sos."endTime" as endDate
      from service_orders_services sos
      inner join service_orders so on so.id = sos."serviceOrderId"
      inner join people p on p.id = sos."executorId"
      where sos."isEnded" = true
      order by p."name"
    `;

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
  }),
  averageTimeBetweenMaintenance: publicProcedure.query(async () => {
    const serviceOrders = await prisma.$queryRaw<
      Array<{
        truck: string;
        startdate: Date;
        enddate: Date;
      }>
    >`
        select
          t.plate || ' - ' || t."name" as truck,
          so."startDate" + so."startTime" as startDate,
          so."endDate" + so."endTime" as endDate
        from service_orders so
        inner join trucks t on t.id = so."truckId"
        where so.status = 'CLOSED'
        order by "startDate"
    `;

    const totalTimeByTruck: {
      truck: string;
      totalTime: number;
      counter: number;
      lastEndDate: Date;
    }[] = [];

    for (const serviceOrder of serviceOrders) {
      const truckIndex = totalTimeByTruck.findIndex(
        (item) => item.truck === serviceOrder.truck
      );

      if (truckIndex !== -1) {
        totalTimeByTruck[truckIndex].totalTime += moment(
          serviceOrder.startdate
        ).diff(moment(totalTimeByTruck[truckIndex].lastEndDate), 'm');
        totalTimeByTruck[truckIndex].counter += 1;
        totalTimeByTruck[truckIndex].lastEndDate = serviceOrder.enddate;
      } else {
        totalTimeByTruck.push({
          truck: serviceOrder.truck,
          totalTime: 0,
          counter: 1,
          lastEndDate: serviceOrder.enddate,
        });
      }
    }

    const averageTimeByTruck = totalTimeByTruck.reduce((acc, curr) => {
      if (curr.totalTime === 0) {
        return acc;
      }

      acc.push({
        truck: curr.truck,
        totalTime: curr.totalTime / 60,
        averageTime: (curr.totalTime / 60) / curr.counter,
        formattedTime: formatHours((curr.totalTime / 60) / curr.counter),
        averageDays: formatDays(((curr.totalTime / 60) / 24) / curr.counter)
      });

      return acc;
    }, [] as {
      truck: string;
      totalTime: number;
      averageTime: number;
      formattedTime: string;
      averageDays: string;
    }[]);

    averageTimeByTruck.sort((a, b) => b.averageTime - a.averageTime);

    return averageTimeByTruck;
  }),
});
