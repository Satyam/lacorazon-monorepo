import juris from '@src/juris.js';

juris.registerComponent('ListVendedores', (props, { getState, setState }) => ({
  render: () => {
    setState('title', 'Vendedores');

    return { p: { text: 'Vendedores' } };
  },
}));
