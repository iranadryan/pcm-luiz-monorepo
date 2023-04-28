import { z } from 'zod';
import { publicProcedure, router } from '../lib/trpc';
import { prisma } from '../lib/prisma';
import { TRPCError } from '@trpc/server';

export const personRouter = router({
  list: publicProcedure
    .input(z.enum(['DRIVER', 'MECHANIC']).optional())
    .query(async ({ input }) => {
      const people = await prisma.person.findMany({
        where: {
          ...(input && { role: input })
        },
        orderBy: [
          { role: 'asc' },
          { name: 'asc' },
        ]
      });

      return people;
    }),
  find: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const person = await prisma.person.findUnique({
        select: {
          id: true,
          code: true,
          name: true,
          role: true
        },
        where: {
          id: input
        }
      });

      if (!person) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Person does not exists'
        });
      }

      return person;
    }),
  create: publicProcedure
    .input(z.object({
      code: z.number().optional(),
      name: z.string().trim(),
      role: z.enum(['DRIVER', 'MECHANIC'])
    }))
    .mutation(async ({ input }) => {
      const personExists = await prisma.person.findUnique({
        where: {
          code: input.code
        }
      });

      if (personExists) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Já existe uma pessoa com este código, por favor insira outro'
        });
      }

      const person = await prisma.person.create({
        data: input
      });

      return person;
    }),
  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        code: z.number().optional(),
        name: z.string().trim(),
        role: z.enum(['DRIVER', 'MECHANIC'])
      })
    )
    .mutation(async ({ input }) => {
      const personExists = await prisma.person.findUnique({
        where: {
          id: input.id
        }
      });

      if (!personExists) {
        throw new Error(`Person does not exists: ${input}`);
      }

      const person = await prisma.person.update({
        where: {
          id: input.id
        },
        data: input
      });

      return person;
    }),
  bulkCreate: publicProcedure
    .input(z.object({
      role: z.enum(['DRIVER', 'MECHANIC']),
      people: z.array(
        z.object({
          code: z.number().optional(),
          name: z.string().trim(),
          role: z.enum(['DRIVER', 'MECHANIC'])
        })
      )
    }))
    .mutation(async ({ input }) => {
      if (input.role === 'DRIVER') {
        await prisma.person.createMany({
          data: input.people
        });
      }

      if (input.role === 'MECHANIC') {
        for (const data of input.people) {
          await prisma.person.upsert({
            create: data,
            update: data,
            where: {
              code: data.code,
            },
          });
        }
      }
    }),
  delete: publicProcedure
    .input(z.string())
    .mutation(async ({ input }) => {
      const personExists = await prisma.person.findUnique({
        where: {
          id: input
        }
      });

      if (!personExists) {
        throw new Error(`Person does not exists: ${input}`);
      }

      const serviceOrder = await prisma.serviceOrder.findFirst({
        where: {
          driverId: input
        }
      });
      const serviceOrderService = await prisma.serviceOrderService.findFirst({
        where: {
          executorId: input
        }
      });

      if (serviceOrder || serviceOrderService) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Pessoa não pode ser deletada. Existem ordens de serviço associadas a esta pessoa.'
        });
      }

      await prisma.person.delete({
        where: {
          id: input
        }
      });
    }),
});
