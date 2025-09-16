import juris from '@src/jurisInstance.js';
import { match } from 'path-to-regexp';

import '@pages/Home.js';
import '@pages/Login.js';
import '@pages/vendedor/ListVendedores.jsx';
import '@pages/ventas/ListVentas.js';
import '@pages/ventas/ShowVenta.js';
import '@pages/ventas/EditVenta.js';

const routes = {
  '/': 'Home',
  '/login': 'Login',
  '/vendedores': 'ListVendedores',
  '/ventas': 'ListVentas',
  '/venta/edit/:id': 'EditVenta',
  '/venta/new': ['EditVenta', { isNew: true }],
  '/venta/:id': 'ShowVenta',
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
              let dest = _routes[i + 1];
              let params = match.params;
              if (Array.isArray(dest)) {
                params = { ...params, ...dest[1] };
                dest = dest[0];
              }
              return {
                // The `Object.setPrototyepOf` is needed because `match.params` is a
                // "null-prototype object".
                // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object#null-prototype_objects
                [dest]: Object.setPrototypeOf(params, Object.prototype),
              };
            }
          }
          return { NotFoundPage: {} };
        },
      },
    }),
  };
});
