import { h } from 'preact';

import Providers from './Providers';
import ErrorBoundary from './ErrorBoundary';
import { Navigation } from 'components/Navigation';
import Routes from './Routes';

const App = () => (
  <Providers>
    <ErrorBoundary>
      <Navigation />
      <Routes />
    </ErrorBoundary>
  </Providers>
);

export default App;
