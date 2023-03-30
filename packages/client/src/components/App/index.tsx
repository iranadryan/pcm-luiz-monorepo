import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import SuperJSON from 'superjson';
import { trpc } from '../../lib/trpc';

import { GlobalStyles } from '../../styles/GlobalStyles';
import { SelectModalStyles } from '../../styles/SelectModalStyles';
import { Header } from '../Header';
import { Container } from './styles';
import { Routes } from '../../Routes';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { ToastContainer } from '../Toast/ToastContainer';

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient({
    transformer: SuperJSON,
    links: [
      httpBatchLink({
        // url: 'https://pcm-luiz-api.onrender.com/trpc'
        url: 'http://localhost:3001/trpc'
        // url: 'http://3.137.211.109/trpc'
      })
    ]
  }));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <Container>
          <SelectModalStyles />
          <GlobalStyles />
          <Header />
          <Routes />
        </Container>
        <ToastContainer />
      </QueryClientProvider>
    </trpc.Provider>
  );
}
