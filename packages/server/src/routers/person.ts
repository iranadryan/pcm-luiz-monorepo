import { z } from 'zod';
import { publicProcedure, router } from '../lib/trpc';
import { prisma } from '../lib/prisma';

export const personRouter = router({
  list: publicProcedure
    .input(z.enum(['DRIVER', 'MECHANIC']).optional())
    .query(async ({ input }) => {
      const people = await prisma.person.findMany({
        where: {
          ...(input && { role: input })
        },
        orderBy: {
          name: 'asc'
        }
      });

      return people;
    }),
  create: publicProcedure
    .input(z.object({
      code: z.number().optional(),
      name: z.string().trim(),
      role: z.enum(['DRIVER', 'MECHANIC'])
    }))
    .mutation(async ({ input }) => {
      const person = await prisma.person.create({
        data: input
      });

      return person;
    })
});
