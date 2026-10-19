import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import { QueryClient } from '@tanstack/react-query';
import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client';
import { createSyncStoragePersister } from '@tanstack/query-sync-storage-persister';
import { App } from './App.tsx';
import './index.css';

const queryClient = new QueryClient();

// O último dado fica no aparelho: o app abre na hora (e offline) com ele, e busca o novo em seguida
const persister = createSyncStoragePersister({
  storage: (() => {
    try {
      return window.localStorage;
    } catch {
      return undefined;
    }
  })(),
  key: 'blumet:cache',
  throttleTime: 1000,
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PersistQueryClientProvider client={queryClient} persistOptions={{ persister, maxAge: 7 * 24 * 3600_000, buster: __VERSAO__ }}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistQueryClientProvider>
  </StrictMode>,
);
