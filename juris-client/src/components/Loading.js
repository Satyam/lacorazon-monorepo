juris.registerComponent('Error', (props, context) => ({
  render: () => ({
    div: {
      id: 'error',
      className: 'alert alert-danger hidden',
      children: [
        {
          i: {
            className: 'bi bi-exclamation-triangle',
          },
        }, // i>
        {
          span: {
            className: 'msg',
          },
        }, // span>
      ],
    }, // div>
  }),
}));

juris.registerComponent('Loading', (props, { getState }) => ({
  render: () =>
    getState('fetch.loading') > 0
      ? {
          Modal: {
            headerVariant: 'secondary',
            header: [
              {
                i: {
                  className: 'bi bi-hourglass-split',
                },
              }, // i>
              'loading ..',
            ], // header
            body: {
              details: {
                children: [
                  { summary: { text: 'Loading Details' } },
                  { pre: { text: getState('fetch.details').join('\n') } },
                ],
              },
            }, // body
          }, // Modal
        }
      : 'not loading',
}));
