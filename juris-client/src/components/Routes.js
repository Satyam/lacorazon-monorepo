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
