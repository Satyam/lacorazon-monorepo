import juris from '@src/jurisInstance.js';
import { match } from 'path-to-regexp';

import '@pages/Home.js';
import '@pages/Login.js';
import '@pages/vendedor/ListVendedores.jsx';
import '@pages/ventas/ListVentas.js';

const routes = {
  '/': 'Home',
  '/login': 'Login',
  '/vendedores': 'ListVendedores',
  '/ventas': 'ListVentas',
};

juris.registerComponent('Routes', (props, { getState }) => {
  const _routes = Object.entries(routes).reduce(
    (r, [route, path]) => [...r, match(route), path],
    []
  );

  return {
    render: () => ({
      div: {
        children: () => {
          const path = getState('url.path');
          const rLen = _routes.length;
          for (let i = 0; i < rLen; i += 2) {
            const match = _routes[i](path);
            if (match) {
              return { [_routes[i + 1]]: match.params };
            }
          }
          return { NotFoundPage: {} };
        },
      },
    }),
  };
});
