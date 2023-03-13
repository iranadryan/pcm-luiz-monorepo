import { publicProcedure, router } from '../lib/trpc';
import { prisma } from '../lib/prisma';
import { z } from 'zod';
import {
  closeInputSchemaValidation,
  createInputSchemaValidation,
  listOutputSchemaValidation,
} from './schemasValidation/serviceOrder';

export const serviceOrderRouter = router({
  list: publicProcedure
    .output(listOutputSchemaValidation)
    .query(async () => {
      const serviceOrders = await prisma.serviceOrder.findMany({
        select: {
          id: true,
          number: true,
          status: true,
          startDate: true,
          endDate: true,
          truck: {
            select: {
              plate: true,
            },
          },
          driver: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [
          { startDate: 'desc' },
          { startTime: 'desc' },
        ]
      });

      return serviceOrders;
    }),
  get: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const serviceOrder = await prisma.serviceOrder.findUnique({
        select: {
          id: true,
          number: true,
          status: true,
          startDate: true,
          startTime: true,
          endDate: true,
          endTime: true,
          odometer: true,
          observation: true,
          truck: {
            select: {
              plate: true,
            },
          },
          driver: {
            select: {
              name: true,
            },
          },
          ServiceOrderService: {
            select: {
              id: true,
              startTime: true,
              endDate: true,
              endTime: true,
              service: {
                select: {
                  code: true,
                  name: true,
                }
              },
              executor: {
                select: {
                  name: true,
                }
              },
              ServiceOrderServiceMaterial: {
                select: {
                  id: true,
                  quantity: true,
                  material: {
                    select: {
                      code: true,
                      name: true,
                    }
                  }
                }
              }
            }
          }
        },
        where: {
          id: input
        }
      });

      if (!serviceOrder) {
        throw new Error(`Service order does not exists: ${input}`);
      }

      return serviceOrder;
    }),
  create: publicProcedure
    .input(createInputSchemaValidation)
    .mutation(async ({ input }) => {
      const { services } = input;
      const serviceOrderInput = {
        startDate: input.startDate,
        startTime: input.startTime,
        truckId: input.truckId,
        driverId: input.driverId,
        odometer: input.odometer,
        observation: input.observation,
      };
      const serviceOrder = await prisma.serviceOrder.create({
        data: serviceOrderInput
      });

      for (const service of services) {
        const { materials } = service;
        const serviceOrderServiceInput = {
          serviceId: service.serviceId,
          executorId: service.executorId,
          startTime: service.startTime,
          endDate: service.endDate,
          endTime: service.endTime,
          serviceOrderId: serviceOrder.id
        };
        const serviceOrderService = await prisma.serviceOrderService.create({
          data: serviceOrderServiceInput,
        });

        for (const material of materials) {
          await prisma.serviceOrderServiceMaterial.create({
            data: {
              ...material,
              serviceOrderServiceId: serviceOrderService.id
            },
          });
        }
      }

      return serviceOrder;
    }),
  close: publicProcedure
    .input(closeInputSchemaValidation)
    .mutation(async ({ input }) => {
      const serviceOrderExists = await prisma.serviceOrder.findUnique({
        where: {
          id: input.id
        }
      });

      if (!serviceOrderExists) {
        throw new Error(`Service order does not exists: ${input.id}`);
      }

      const serviceOrder = await prisma.serviceOrder.update({
        where: {
          id: input.id
        },
        data: {
          number: input.number,
          endDate: input.endDate,
          endTime: input.endTime,
          status: 'CLOSED'
        }
      });

      return serviceOrder;
    })
});
