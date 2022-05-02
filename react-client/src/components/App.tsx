import Providers from './Providers';
import ErrorBoundary from './ErrorBoundary';
import { Navigation } from 'components/Navigation';
import { Outlet } from 'react-router-dom';

const App = () => (
  <Providers>
    <ErrorBoundary>
      <Navigation />
      <Outlet />
    </ErrorBoundary>
  </Providers>
);

export default App;
