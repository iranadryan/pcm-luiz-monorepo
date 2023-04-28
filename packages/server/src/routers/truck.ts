import { z } from 'zod';
import { publicProcedure, router } from '../lib/trpc';
import { prisma } from '../lib/prisma';
import { TRPCError } from '@trpc/server';

export const truckRouter = router({
  list: publicProcedure
    .query(async () => {
      const trucks = await prisma.truck.findMany({
        orderBy: {
          plate: 'asc',
        },
      });

      return trucks;
    }),
  find: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const truck = await prisma.truck.findUnique({
        select: {
          id: true,
          name: true,
          plate: true,
          type: true,
        },
        where: {
          id: input
        }
      });

      if (!truck) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Truck does not exists'
        });
      }

      return truck;
    }),
  create: publicProcedure
    .input(
      z.object({
        name: z.string().trim(),
        plate: z.string().trim(),
        type: z.enum(['TRACTOR_UNIT', 'SEMI_TRAILER']),
      })
    )
    .mutation(async ({ input }) => {
      const truckExists = await prisma.truck.findUnique({
        where: {
          plate: input.plate
        }
      });

      if (truckExists) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Placa já existe, por favor insira uma nova placa.'
        });
      }

      const truck = await prisma.truck.create({
        data: input,
      });

      return truck;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().trim(),
        plate: z.string().trim(),
        type: z.enum(['TRACTOR_UNIT', 'SEMI_TRAILER']),
      })
    )
    .mutation(async ({ input }) => {
      const truckExists = await prisma.truck.findUnique({
        where: {
          id: input.id
        }
      });

      if (!truckExists) {
        throw new Error(`Truck does not exists: ${input}`);
      }

      const truck = await prisma.truck.update({
        where: {
          id: input.id
        },
        data: input
      });

      return truck;
    }),
  bulkCreate: publicProcedure
    .input(
      z.array(
        z.object({
          name: z.string().trim(),
          plate: z.string().trim(),
          type: z.enum(['TRACTOR_UNIT', 'SEMI_TRAILER']),
        })
      )
    )
    .mutation(async ({ input }) => {
      for (const data of input) {
        await prisma.truck.upsert({
          create: data,
          update: data,
          where: {
            plate: data.plate
          }
        });
      }
    }),
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const truckExists = await prisma.truck.findUnique({
        where: {
          id: input
        }
      });

      if (!truckExists) {
        throw new Error(`Truck does not exists: ${input}`);
      }

      const serviceOrder = await prisma.serviceOrder.findFirst({
        where: {
          truckId: input
        }
      });

      if (serviceOrder) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Placa não pode ser deletada. Existem ordens de serviço associadas a esta placa.'
        });
      }

      await prisma.truck.delete({
        where: {
          id: input
        }
      });
    }),
});
