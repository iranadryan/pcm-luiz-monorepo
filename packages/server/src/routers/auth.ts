import bcrypt from 'bcryptjs';
import { z } from 'zod';
import { publicProcedure, router } from '../lib/trpc';
import { prisma } from '../lib/prisma';
import { TRPCError } from '@trpc/server';
import { signJwt } from '../utils/jwt';

export const authRouter = router({
  authenticate: publicProcedure.input(
    z.object({
      username: z.string().trim(),
      password: z.string().trim()
    })
  ).mutation(async ({ input }) => {
    const user = await prisma.user.findUnique({
      where: {
        username: input.username
      }
    });

    if (!user) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Nome de usuário incorreto'
      });
    }

    if (!user.active) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Usuário inativo, entre em contato com o administrador.'
      });
    }

    const passwordMatch = await bcrypt.compare(input.password, user.password);

    if (!passwordMatch) {
      throw new TRPCError({
        code: 'BAD_REQUEST',
        message: 'Senha incorreta!'
      });
    }

    const token = signJwt({
      id: user.id,
      role: user.role,
      name: user.name
    }, {
      expiresIn: '30 days'
    });

    return {
      token,
      user: {
        name: user.name,
        role: user.role
      }
    };
  })
});
