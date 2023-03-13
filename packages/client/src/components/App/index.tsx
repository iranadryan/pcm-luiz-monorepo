import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import SuperJSON from 'superjson';
import { trpc } from '../../lib/trpc';

import { GlobalStyles } from '../../styles/GlobalStyles';
import { AntSelectStyles } from '../../styles/AntSelectStyles';
import { Header } from '../Header';
import { Container } from './styles';
import { Routes } from '../../Routes';

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient({
    transformer: SuperJSON,
    links: [
      httpBatchLink({
        url: 'https://pcm-luiz-api.onrender.com/trpc'
      })
    ]
  }));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Container>
          <AntSelectStyles />
          <GlobalStyles />
          <Header />
          <Routes />
        </Container>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
