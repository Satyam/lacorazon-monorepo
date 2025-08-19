juris.registerComponent(
  'Home',
  (props, { setState, getState, services, utils }) => ({
    render: () => {
      setState('title', 'Bienvenido');
      return {
        pre: {
          text:
            'state:\n' +
            JSON.stringify(juris.stateManager.state, null, 2) +
            '\nservices\n' +
            JSON.stringify(services, null, 2) +
            '\nheadless\n' +
            JSON.stringify(utils.getHeadlessStatus(), null, 2),
        },
      };
    },
  })
);
