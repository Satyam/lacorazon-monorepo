juris.registerComponent('Home', (props, { setState, getState }) => {
  setState('title', 'Bienvenido');
  return { pre: { text: JSON.stringify(juris.stateManager.state, null, 2) } };
});
