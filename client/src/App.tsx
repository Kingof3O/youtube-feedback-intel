import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Sync } from './pages/Sync';
import { Explorer } from './pages/Explorer';
import { Rules } from './pages/Rules';

import { ToastProvider } from './components/ui/Toast';

const queryClient = new QueryClient();

function App() {
  return (
    <ToastProvider>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="sync" element={<Sync />} />
              <Route path="explorer" element={<Explorer />} />
              <Route path="rules" element={<Rules />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </QueryClientProvider>
    </ToastProvider>
  );
}

export default App;
