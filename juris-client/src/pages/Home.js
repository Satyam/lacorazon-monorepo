import juris from '@src/jurisInstance.js';

juris.registerComponent('Home', (props, { setState, getState }) => ({
  render: () => {
    setState('title', 'Bienvenido');
    // return {
    //   pre: {
    //     text: () =>
    //       '\nstate:\n' + JSON.stringify(juris.stateManager.state, null, 2),
    //   },
    // };
  },
}));
