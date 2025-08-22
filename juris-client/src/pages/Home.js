juris.registerComponent('Home', (props, { setState, getState }) => ({
  render: () => {
    setState('title', 'Bienvenido');
    return {
      pre: {
        text: () =>
          JSON.stringify(getState('data'), null, 1) +
          '\nstate:\n' +
          JSON.stringify(juris.stateManager.state, null, 2),
      },
    };
  },
}));
