import { FunctionComponent, h } from 'preact';

import Providers from './Providers';
import ErrorBoundary from './ErrorBoundary';
import { Navigation } from 'components/Navigation';
import Routes from './Routes';

const App: FunctionComponent = () => (
  <Providers>
    <ErrorBoundary>
      <Navigation />
      <Routes />
    </ErrorBoundary>
  </Providers>
);

export default App;
