import juris from '@src/juris.js';
import '@pages/Home.js';
import '@pages/Login.js';
import '@pages/vendedor/ListVendedores.js';
import '@pages/ventas/ListVentas.js';

juris.registerComponent('Routes', (props, { getState }) => ({
  render: () => ({
    div: {
      children: () => {
        const path = getState('url.path');
        switch (path) {
          case '/':
            return { Home: {} };
          case '/login':
            return { Login: {} };
          case '/vendedores':
            return { ListVendedores: {} };
          case '/ventas':
            return { ListVentas: {} };
          default:
            return { NotFoundPage: {} };
        }
      },
    },
  }),
}));
