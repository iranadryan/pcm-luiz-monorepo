import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import path from 'node:path';
import * as trpcExpress from '@trpc/server/adapters/express';
import { inferAsyncReturnType } from '@trpc/server';
import { expressHandler } from 'trpc-playground/handlers/express';
import { router } from './lib/trpc';

import { truckRouter } from './routers/truck';
import { productRouter } from './routers/product';
import { personRouter } from './routers/person';
import { serviceRouter } from './routers/service';
import { serviceOrderRouter } from './routers/serviceOrder';
import { serviceOrderDashboardRouter } from './routers/serviceOrderDashboard';
import { authRouter } from './routers/auth';
import { userRouter } from './routers/user';

const appRouter = router({
  truck: truckRouter,
  product: productRouter,
  person: personRouter,
  service: serviceRouter,
  serviceOrder: serviceOrderRouter,
  serviceOrderDashboard: serviceOrderDashboardRouter,
  user: userRouter,
  auth: authRouter,
});
const createContext = () => ({});

export type AppRouter = typeof appRouter;
export type Context = inferAsyncReturnType<typeof createContext>;

async function main() {
  const app = express();
  const port = process.env.PORT || 3001;

  app.use(cors());
  app.use('/reports', express.static(path.resolve(__dirname, '..', 'reports')));
  app.use(
    '/trpc',
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    }),
  );
  app.use(
    '/playground',
    await expressHandler({
      trpcApiEndpoint: '/trpc',
      playgroundEndpoint: '/playground',
      router: appRouter,
    }),
  );

  app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
  });
}

main();
