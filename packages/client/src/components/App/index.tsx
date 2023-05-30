import { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import SuperJSON from 'superjson';
import { trpc } from '../../lib/trpc';

import { GlobalStyles } from '../../styles/GlobalStyles';
import { SelectModalStyles } from '../../styles/SelectModalStyles';
import { Header } from '../Header';
import { AppContainer, Container } from './styles';
import { Routes } from '../../Routes';

import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import { ToastContainer } from '../Toast/ToastContainer';
import { FilterContextProvider } from '../../contexts/FilterContext';
import { Sidebar } from '../Sidebar';
import { ResponsiveContextProvider } from '../../contexts/ResponsiveContext';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  ChartDataLabels,
);

export function App() {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => trpc.createClient({
    transformer: SuperJSON,
    links: [
      httpBatchLink({
        // url: 'https://pcm-luiz-api.onrender.com/trpc'
        // url: 'http://localhost:3001/trpc'
        // url: 'http://3.137.211.109/trpc'
        url: 'https://api.sistemapcm.com/trpc'
      })
    ]
  }));

  return (
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <ResponsiveContextProvider>
          <FilterContextProvider>
            <AppContainer>
              <Sidebar />
              <Container>
                <SelectModalStyles />
                <GlobalStyles />
                <Header />
                <Routes />
              </Container>
            </AppContainer>
            <ToastContainer />
          </FilterContextProvider>
        </ResponsiveContextProvider>
      </QueryClientProvider>
    </trpc.Provider>
  );
}
