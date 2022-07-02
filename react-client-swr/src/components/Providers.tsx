import { IntlProvider } from 'providers/Intl';
import { ModalsProvider } from 'providers/Modals';
import { AuthProvider } from 'providers/Auth';

const Providers = ({ children }: { children: React.ReactNode }) => (
  <IntlProvider locale="es-ES">
    <ModalsProvider>
      <AuthProvider>{children}</AuthProvider>
    </ModalsProvider>
  </IntlProvider>
);

export default Providers;
