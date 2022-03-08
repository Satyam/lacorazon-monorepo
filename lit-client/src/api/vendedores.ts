export const listVendedoresOp = (
  options?: OptionsType
): OPERATION<undefined> => ({
  service: 'vendedores',
  op: 'list',
  options,
});

export const getVendedorOp = (
  id: ID,
  options?: OptionsType
): OPERATION<undefined> => ({
  service: 'vendedores',
  op: 'get',
  id,
  options,
});

export const removeVendedorOp = (
  id: ID,
  options?: OptionsType
): OPERATION<undefined> => ({
  service: 'vendedores',
  op: 'remove',
  id,
  options,
});
