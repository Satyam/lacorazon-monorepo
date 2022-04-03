import { h, ComponentChildren } from 'preact';
import { IntlProvider } from 'providers/Intl';
import { ModalsProvider } from 'providers/Modals';
import { QueryClientProvider, QueryClient } from 'react-query';
import { AuthProvider } from 'providers/Auth';

const Providers = ({ children }: { children: ComponentChildren }) => (
  <QueryClientProvider client={new QueryClient()}>
    <IntlProvider locale="es-ES">
      <ModalsProvider>
        <AuthProvider>{children}</AuthProvider>
      </ModalsProvider>
    </IntlProvider>
  </QueryClientProvider>
);

export default Providers;
