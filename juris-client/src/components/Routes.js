juris.registerComponent('Routes', (props, { getState }) => ({
  render: () => ({
    div: {
      children: () => {
        const path = getState('url.path');
        switch (path) {
          case '/':
            return [{ Home: {} }];
          case '/about':
            return [{ AboutPage: {} }];
          default:
            return [{ NotFoundPage: {} }];
        }
      },
    },
  }),
}));
