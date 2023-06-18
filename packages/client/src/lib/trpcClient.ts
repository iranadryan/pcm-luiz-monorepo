import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from 'server';
import SuperJSON from 'superjson';

// export const trpcUrl = 'http://localhost:3001/trpc';
export const trpcUrl = 'https://api.sistemapcm.com/trpc';
// export const trpcUrl = 'http://3.22.99.134/trpc';

export const trpcClient = createTRPCProxyClient<AppRouter>({
  transformer: SuperJSON,
  links: [
    httpBatchLink({
      url: trpcUrl,
    }),
  ],
});
