export const removeVentaOp = (
  id: ID,
  options?: OptionsType
): OPERATION<undefined> => ({
  service: 'ventas',
  op: 'remove',
  id,
  options,
});

export const getVentaOp = (
  id: ID,
  options?: OptionsType
): OPERATION<undefined> => ({
  service: 'ventas',
  op: 'get',
  id,
  options,
});

export const listVentasOp = (options?: OptionsType): OPERATION<undefined> => ({
  service: 'ventas',
  op: 'list',
  options,
});
