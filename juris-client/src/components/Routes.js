juris.registerComponent('Routes', (props, { getState }) => {
  return {
    render: () => ({
      div: {
        children: () => {
          const path = getState('url.service');

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
  };
});
