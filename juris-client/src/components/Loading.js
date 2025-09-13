import juris from '@src/jurisInstance.js';
import '@components/Modal.js';

const LOADING = 'loading';

juris.registerComponent('Loading', (props, { getState, setState }) => {
  return {
    render: () =>
      getState(LOADING, []).length > 0
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
                    { pre: { text: getState(LOADING).join('\n') } },
                  ],
                },
              }, // body
            }, // Modal
          }
        : null,
  };
});

juris.registerHeadlessComponent(
  'LoadingMgr',
  (props, { getState, setState }) => {
    return {
      api: {
        open: (message) => {
          setState(LOADING, [...getState(LOADING, []), message]);
        },
        close: (message) => {
          setState(
            LOADING,
            getState(LOADING, []).filter((msg) => msg !== message)
          );
        },
      },
    };
  },
  { autoInit: true }
);
