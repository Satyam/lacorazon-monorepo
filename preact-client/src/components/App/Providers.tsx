import { FunctionComponent, h } from 'preact';
import { IntlProvider } from 'providers/Intl';
import { ModalsProvider } from 'providers/Modals';
import { QueryClientProvider, QueryClient } from 'react-query';

const Providers: FunctionComponent = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    <IntlProvider locale="es-ES">
      <ModalsProvider>{children}</ModalsProvider>
    </IntlProvider>
  </QueryClientProvider>
);

export default Providers;
