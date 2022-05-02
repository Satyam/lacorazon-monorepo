import { IntlProvider } from 'providers/Intl';
import { ModalsProvider } from 'providers/Modals';
import { AuthProvider } from 'providers/Auth';
import { QueryProvider } from 'providers/Query';

const Providers = ({ children }: { children: React.ReactNode }) => (
  <QueryProvider>
    <IntlProvider locale="es-ES">
      <ModalsProvider>
        <AuthProvider>{children}</AuthProvider>
      </ModalsProvider>
    </IntlProvider>
  </QueryProvider>
);

export default Providers;
