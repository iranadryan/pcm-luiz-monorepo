import { z } from 'zod';
import { publicProcedure, router } from '../lib/trpc';
import { prisma } from '../lib/prisma';
import { TRPCError } from '@trpc/server';

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
  find: publicProcedure
    .input(z.string())
    .query(async ({ input }) => {
      const product = await prisma.product.findUnique({
        select: {
          id: true,
          code: true,
          name: true,
        },
        where: {
          id: input
        }
      });

      if (!product) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Product does not exists'
        });
      }

      return product;
    }),
  create: publicProcedure
    .input(z.object({
      code: z.number(),
      name: z.string().trim(),
    }))
    .mutation(async ({ input }) => {
      const productExists = await prisma.product.findUnique({
        where: {
          code: input.code,
        }
      });

      if (productExists) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Já existe um produto com este código, por favor insira outro'
        });
      }

      const product = await prisma.product.create({
        data: input
      });

      return product;
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
      const productExists = await prisma.product.findUnique({
        where: {
          id: input.id
        }
      });

      if (!productExists) {
        throw new Error(`Product does not exists: ${input}`);
      }

      const product = await prisma.product.update({
        where: {
          id: input.id
        },
        data: input
      });

      return product;
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
        await prisma.product.upsert({
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
      const productExists = await prisma.product.findUnique({
        where: {
          id: input
        }
      });

      if (!productExists) {
        throw new Error(`product does not exists: ${input}`);
      }

      const serviceOrder = await prisma.serviceOrderServiceMaterial.findFirst({
        where: {
          materialId: input
        }
      });

      if (serviceOrder) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Produto não pode ser deletado. Existem ordens de serviço associadas a este produto.'
        });
      }

      await prisma.product.delete({
        where: {
          id: input
        }
      });
    }),
});
