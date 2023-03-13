import { z } from 'zod';
import { publicProcedure, router } from '../lib/trpc';
import { prisma } from '../lib/prisma';

export const serviceRouter = router({
  list: publicProcedure
    .query(async () => {
      const services = await prisma.service.findMany({
        orderBy: {
          code: 'asc',
        }
      });

      return services;
    }),
  create: publicProcedure
    .input(z.object({
      code: z.number(),
      name: z.string().trim(),
    }))
    .mutation(async ({ input }) => {
      const service = await prisma.service.create({
        data: input
      });

      return service;
    })
});
