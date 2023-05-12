import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from 'server';
import SuperJSON from 'superjson';

export const trpcClient = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: 'http://localhost:3001/trpc',
      // url: 'https://api.sistemapcm.com/trpc'
    }),
  ],
});
