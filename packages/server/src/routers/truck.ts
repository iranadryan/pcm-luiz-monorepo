import { z } from 'zod';
import { publicProcedure, router } from '../lib/trpc';
import { prisma } from '../lib/prisma';

export const truckRouter = router({
  list: publicProcedure
    .query(async () => {
      const trucks = await prisma.truck.findMany({
        orderBy: {
          plate: 'asc',
        }
      });

      return trucks;
    }),
  create: publicProcedure
    .input(z.object({
      name: z.string().trim(),
      plate: z.string().trim(),
      type: z.enum(['TRACTOR_UNIT', 'SEMI_TRAILER'])
    }))
    .mutation(async ({ input }) => {
      const truck = await prisma.truck.create({
        data: input
      });

      return truck;
    })
});
