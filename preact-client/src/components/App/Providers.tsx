import { FunctionComponent, h } from 'preact';
import { IntlProvider } from 'providers/Intl';
import { ModalsProvider } from 'providers/Modals';

const Providers: FunctionComponent = ({ children }) => (
  <IntlProvider locale="es-ES">
    <ModalsProvider>{children}</ModalsProvider>
  </IntlProvider>
);

export default Providers;
