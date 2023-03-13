import { z } from 'zod';
import { publicProcedure, router } from '../lib/trpc';
import { prisma } from '../lib/prisma';

export const productRouter = router({
  list: publicProcedure
    .query(async () => {
      const products = await prisma.product.findMany({
        orderBy: {
          code: 'asc',
        }
      });

      return products;
    }),
  create: publicProcedure
    .input(z.object({
      code: z.number(),
      name: z.string().trim(),
    }))
    .mutation(async ({ input }) => {
      const product = await prisma.product.create({
        data: input
      });

      return product;
    })
});
