import moment from 'moment';
import {
  differenceInBusinessDays,
  differenceInMinutes,
  eachMonthOfInterval,
} from 'date-fns';
import { prisma } from '../lib/prisma';
import { publicProcedure, router } from '../lib/trpc';
import { firstLetterUppercase } from '../utils/firstLetterUppercase';
import { formatHours } from '../utils/formatHours';
import { formatDays } from '../utils/formatDays';
import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { takeTwoNames } from '../utils/takeTwoNames';
import { getServiceHoursByMechanic } from '../utils/getServiceHoursByMechanic';
import { getDaysBetweenDates } from '../utils/getDaysBetweenDates';

export type serviceType = {
  id: string;
  name: string;
  startdate: Date;
  enddate: Date;
}

export const serviceOrderDashboardRouter = router({
  openClosedTotal: publicProcedure
    .input(z.object({
      startDate: z.date().nullable(),
      endDate: z.date().nullable()
    }).optional())
    .query(async ({ input }) => {
      if (
        input &&
        input.startDate &&
        input.endDate &&
        input.startDate > input.endDate
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Start date must be higher than end date'
        });
      }

      const openClosedTotal = await prisma.serviceOrder.groupBy({
        by: ['status'],
        _count: {
          _all: true,
        },
        orderBy: {
          status: 'asc',
        },
        where: {
          ...(input?.startDate && { startDate: {
            gte: input.startDate
          } }),
          ...(input?.endDate && { endDate: {
            lte: input.endDate
          } }),
        }
      });

      return {
        openTotal: openClosedTotal.find((item) => item.status === 'OPEN')?._count._all || 0,
        closedTotal: openClosedTotal.find((item) => item.status === 'CLOSED')?._count._all || 0,
        launchedTotal: openClosedTotal.find((item) => item.status === 'LAUNCHED')?._count._all || 0,
        scheduledTotal: openClosedTotal.find((item) => item.status === 'SCHEDULED')?._count._all || 0,
      };
    }),
  openClosedTotalLastThreeMonths: publicProcedure
    .query(async () => {
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
      const launchedTotalLastThreeMonths = await prisma.$queryRaw<
      Array<{
        total: number;
        month: number;
      }>
    >`
      select
        count(service_orders.id) as total,
        extract(month from service_orders."startDate") as month
      from service_orders
      where service_orders.status = 'LAUNCHED'
      and service_orders."startDate" >= ${startDate}
      group by month
      order by month
    `;

      const parsedData = months.map((date) => {
        const monthNumber = moment(date).month();

        return {
          month: firstLetterUppercase(
            moment(date).locale('pt-BR').format('MMM. [de] YYYY')
          ),
          totalOpen:
          Number (openTotalLastThreeMonths.find((item) => {
            if (monthNumber === item.month - 1) {
              return true;
            }

            return false;
          })?.total || 0),
          totalClosed:
          Number (closedTotalLastThreeMonths.find((item) => {
            if (monthNumber === item.month - 1) {
              return true;
            }

            return false;
          })?.total || 0),
          totalLaunched:
          Number(launchedTotalLastThreeMonths.find((item) => {
            if (monthNumber === item.month - 1) {
              return true;
            }

            return false;
          })?.total || 0),
        };
      });

      return parsedData;
    }),
  totalByService: publicProcedure
    .input(z.object({
      startDate: z.date().nullable(),
      endDate: z.date().nullable()
    }).optional())
    .query(async ({ input }) => {
      if (
        input &&
        input.startDate &&
        input.endDate &&
        input.startDate > input.endDate
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Start date must be higher than end date'
        });
      }

      const totalByService = await prisma.$queryRawUnsafe<
        Array<{
          total: number;
          service: string;
        }>
      >(`
        select
          count(sos.id) as total,
          s."name" as service
        from service_orders_services sos
        left join services s on s.id = sos."serviceId"
        where 1 = 1
        ${input?.startDate ? `and sos."startDate" >= '${moment(input.startDate).format('YYYY-MM-DD')}'` : ''}
        ${input?.endDate ? `and sos."endDate" <= '${moment(input.endDate).format('YYYY-MM-DD')}'` : ''}
        group by service
        order by total desc
      `);

      return totalByService.map((item) => ({
        service: item.service,
        total: Number(item.total)
      }));
    }),
  totalByDriver: publicProcedure
    .input(z.object({
      startDate: z.date().nullable(),
      endDate: z.date().nullable()
    }).optional())
    .query(async ({ input }) => {
      if (
        input &&
        input.startDate &&
        input.endDate &&
        input.startDate > input.endDate
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Start date must be higher than end date'
        });
      }

      const totalByDriver = await prisma.$queryRawUnsafe<
        Array<{
          total: number;
          driver: string;
        }>
      >(`
        select
          count(so.id) as total,
          p."name" as driver
        from service_orders so
        left join people p on p.id = so."driverId"
        where 1 = 1
        ${input?.startDate ? `and so."startDate" >= '${moment(input.startDate).format('YYYY-MM-DD')}'` : ''}
        ${input?.endDate ? `and so."endDate" <= '${moment(input.endDate).format('YYYY-MM-DD')}'` : ''}
        group by driver
        order by total desc
      `);

      return totalByDriver.map((item) => ({
        driver: takeTwoNames(item.driver),
        total: Number(item.total)
      }));
    }),
  totalByMechanic: publicProcedure
    .input(z.object({
      startDate: z.date().nullable(),
      endDate: z.date().nullable()
    }).optional())
    .query(async ({ input }) => {
      if (
        input &&
        input.startDate &&
        input.endDate &&
        input.startDate > input.endDate
      ) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Start date must be higher than end date'
        });
      }

      const totalByMechanic = await prisma.$queryRawUnsafe<
        Array<{
          total: number;
          mechanic: string;
        }>
      >(`
        select
          count(sos.id) as total,
          p."name" as mechanic
        from service_orders_services sos
        left join  people p on p.id = sos."executorId"
        where 1 = 1
        ${input?.startDate ? `and sos."startDate" >= '${moment(input.startDate).format('YYYY-MM-DD')}'` : ''}
        ${input?.endDate ? `and sos."endDate" <= '${moment(input.endDate).format('YYYY-MM-DD')}'` : ''}
        group by mechanic
        order by total desc
      `);

      const motoristaIndex = totalByMechanic.findIndex(
        (item) => item.mechanic === 'MOTORISTA'
      );

      if (motoristaIndex !== -1) {
        totalByMechanic.splice(motoristaIndex, 1);
      }

      return totalByMechanic.map((item) => ({
        mechanic: takeTwoNames(item.mechanic),
        total: Number(item.total)
      }));
    }),
  totalServiceHoursByMechanic: publicProcedure
    .input(z.object({
      mechanicId: z.string().uuid(),
      startDate: z.date(),
      endDate: z.date()
    }))
    .query(async ({ input }) => {
      const services = await prisma.$queryRawUnsafe<serviceType[]>(`
        select
          sos."id",
          p."name",
          sos."startDate" + sos."startTime" as startDate,
          sos."endDate" + sos."endTime" as endDate
        from service_orders_services sos
        inner join people p on p.id = sos."executorId"
        where sos."executorId" = '${input.mechanicId}'
        and sos."startDate" between '${moment(input.startDate).format('YYYY-MM-DD')}' and '${moment(input.endDate).format('YYYY-MM-DD')}'
        and sos."endDate" between '${moment(input.startDate).format('YYYY-MM-DD')}' and '${moment(input.endDate).format('YYYY-MM-DD')}'
        and sos."endTime" notnull
        order by sos."startDate" + sos."startTime"
      `);

      const businessDays = differenceInBusinessDays(
        input.endDate,
        input.startDate,
      );
      const saturdays = getDaysBetweenDates(
        input.startDate,
        input.endDate,
        6
      ).length;

      const goalHours = (businessDays * 8) + (saturdays * 4);

      if (services.length === 0) {
        return {
          weekTotal: {
            mechanic: '',
            hours: 0,
            hoursFormatted: '00:00'
          },
          goalHours
        };
      }

      let servicesNotDuplicated: serviceType[] = [...services];
      const deletedArray: serviceType[] = [];

      servicesNotDuplicated.forEach((currService) => {
        if (deletedArray.findIndex(
          (item) => item.id === currService.id
        ) !== -1) {
          return;
        }

        servicesNotDuplicated.forEach((service) => {
          if (service.id === currService.id) {
            return;
          }

          const startDateDiff = differenceInMinutes(
            service.startdate,
            currService.startdate
          );
          const startEndDateDiff = differenceInMinutes(
            service.enddate,
            currService.startdate,
          );
          const endDateDiff = differenceInMinutes(
            service.enddate,
            currService.enddate,
          );

          if (startDateDiff >= 0 && endDateDiff <= 0) {
            deletedArray.push(service);
            return servicesNotDuplicated = servicesNotDuplicated.filter(
              (i) => i.id !== service.id
            );
          }

          if (startDateDiff < 0 && startEndDateDiff > 0) {
            const index = servicesNotDuplicated.findIndex(
              (i) => i.id === service.id
            );

            if (index !== -1) {
              servicesNotDuplicated[index].enddate = currService.startdate;
            }
          }
        });
      });

      const serviceHours = getServiceHoursByMechanic(servicesNotDuplicated);

      return {
        weekTotal: serviceHours[0],
        goalHours
      };
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
