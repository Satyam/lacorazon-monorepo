juris.registerComponent('ListVentas', (props, { getState, setState }) => ({
  render: () => {
    setState('title', 'Ventas');

    return { p: { text: 'Ventas' } };
  },
}));
