import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { prisma } from '../lib/prisma';
import { publicProcedure, router } from '../lib/trpc';
import { TRPCError } from '@trpc/server';

export const userRouter = router({
  list: publicProcedure.query(async () => {
    const users = await prisma.user.findMany({
      orderBy: {
        username: 'asc'
      }
    });

    return users;
  }),
  find: publicProcedure.input(z.string().uuid()).query(
    async ({ input }) => {
      const user = await prisma.user.findUnique({
        select: {
          id: true,
          personId: true,
          name: true,
          username: true,
          active: true,
          role: true
        },
        where: {
          id: input
        }
      });

      if (!user) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'User does not exists'
        });
      }

      return user;
    }
  ),
  create: publicProcedure.input(
    z.object({
      name: z.string().trim(),
      username: z.string().trim(),
      password: z.string().trim(),
      personId: z.string().uuid().nullable(),
      role: z.enum(['ADMIN', 'DRIVER', 'MECHANIC', 'ATTENDANT'])
    })
  ).mutation(async ({ input }) => {
    const hashedPassword = await bcrypt.hash(input.password, 8);
    const userExists = await prisma.user.findUnique({
      where: {
        username: input.username
      }
    });

    if (userExists) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User already exists'
      });
    }

    const user = await prisma.user.create({
      data: {
        name: input.name,
        username: input.username,
        password: hashedPassword,
        role: input.role,
        personId: input.personId
      }
    });

    return user;
  }),
  update: publicProcedure.input(
    z.object({
      id: z.string().uuid(),
      name: z.string().trim(),
      username: z.string().trim(),
      password: z.string().trim().optional(),
      personId: z.string().uuid().nullable(),
      active: z.boolean(),
      role: z.enum(['ADMIN', 'DRIVER', 'MECHANIC', 'ATTENDANT'])
    })
  ).mutation(async ({ input }) => {
    const hashedPassword = input.password
      ? await bcrypt.hash(input.password, 8)
      : null;
    const userExists = await prisma.user.findUnique({
      where: {
        id: input.id
      }
    });

    if (!userExists) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User does not exists'
      });
    }

    const usernameExists = await prisma.user.findUnique({
      where: {
        username: input.username
      }
    });

    if (usernameExists && usernameExists.id !== userExists.id) {
      throw new TRPCError({
        code: 'CONFLICT',
        message: 'User already exists'
      });
    }

    const user = await prisma.user.update({
      where: {
        id: input.id
      },
      data: {
        name: input.name,
        username: input.username,
        role: input.role,
        personId: input.personId,
        active: input.active,
        ...(hashedPassword && { password: hashedPassword }),
      }
    });

    return user;
  }),
  resetPassword: publicProcedure.input(
    z.object({
      id: z.string().uuid(),
      password: z.string().trim()
    })
  ).mutation(async ({ input }) => {
    const hashedPassword = await bcrypt.hash(input.password, 10);
    const userExists = await prisma.user.findUnique({
      where: {
        id: input.id
      }
    });

    if (!userExists) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: 'User does not exists'
      });
    }

    await prisma.user.update({
      where: {
        id: input.id
      },
      data: {
        password: hashedPassword
      }
    });
  }),
  delete: publicProcedure
    .input(z.string().uuid())
    .mutation(async ({ input }) => {
      const userExists = await prisma.user.findUnique({
        where: {
          id: input
        }
      });

      if (!userExists) {
        throw new Error(`User does not exists: ${input}`);
      }

      await prisma.user.delete({
        where: {
          id: input
        }
      });
    })
});
