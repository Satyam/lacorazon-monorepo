juris.registerComponent('ListVendedores', (props, { getState, setState }) => {
  setState('title', 'Vendedores');

  return { p: { text: 'Vendedores' } };
});
