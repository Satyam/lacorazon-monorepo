juris.registerComponent('ListVentas', (props, { getState, setState }) => {
  setState('title', 'Ventas');

  return { p: { text: 'Ventas' } };
});
