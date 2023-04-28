import { z } from 'zod';
import { publicProcedure, router } from '../lib/trpc';
import { prisma } from '../lib/prisma';
import { TRPCError } from '@trpc/server';

export const serviceRouter = router({
  list: publicProcedure
    .query(async () => {
      const services = await prisma.service.findMany({
        orderBy: {
          code: 'asc',
        },
      });

      return services;
    }),
  find: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const service = await prisma.service.findUnique({
        select: {
          id: true,
          code: true,
          name: true,
        },
        where: {
          id: input
        }
      });

      if (!service) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Service does not exists'
        });
      }

      return service;
    }),
  create: publicProcedure
    .input(
      z.object({
        code: z.number(),
        name: z.string().trim(),
      })
    )
    .mutation(async ({ input }) => {
      const serviceExists = await prisma.service.findUnique({
        where: {
          code: input.code,
        }
      });

      if (serviceExists) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Já existe um serviço com este código, por favor insira outro'
        });
      }

      const service = await prisma.service.create({
        data: input,
      });

      return service;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.number(),
        name: z.string().trim(),
      })
    )
    .mutation(async ({ input }) => {
      const serviceExists = await prisma.service.findUnique({
        where: {
          id: input.id
        }
      });

      if (!serviceExists) {
        throw new Error(`Service does not exists: ${input}`);
      }

      const service = await prisma.service.update({
        where: {
          id: input.id
        },
        data: input
      });

      return service;
    }),
  bulkCreate: publicProcedure
    .input(z.array(
      z.object({
        code: z.number(),
        name: z.string().trim(),
      })
    ))
    .mutation(async ({ input }) => {
      for (const data of input) {
        await prisma.service.upsert({
          create: data,
          update: data,
          where: {
            code: data.code
          },
        });
      }
    }),
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const serviceExists = await prisma.service.findUnique({
        where: {
          id: input
        }
      });

      if (!serviceExists) {
        throw new Error(`service does not exists: ${input}`);
      }

      const serviceOrder = await prisma.serviceOrderService.findFirst({
        where: {
          serviceId: input
        }
      });

      if (serviceOrder) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Serviço não pode ser deletado. Existem ordens de serviço associadas a este produto.'
        });
      }

      await prisma.service.delete({
        where: {
          id: input
        }
      });
    }),
});
