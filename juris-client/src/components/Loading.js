import juris from '@src/juris.js';
import '@components/Modal.js';

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
      : null,
}));
