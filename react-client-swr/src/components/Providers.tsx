import { IntlProvider } from 'providers/Intl';
import { ModalsProvider } from 'providers/Modals';
import { AuthProvider } from 'providers/Auth';
import { ErrorsProvider } from 'providers/ErrorsContext';

const Providers = ({ children }: { children: React.ReactNode }) => (
  <ErrorsProvider>
    <IntlProvider locale="es-ES">
      <ModalsProvider>
        <AuthProvider>{children}</AuthProvider>
      </ModalsProvider>
    </IntlProvider>
  </ErrorsProvider>
);

export default Providers;
