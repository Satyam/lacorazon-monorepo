import { apiFetch } from './apiService';

const listVendedoresOp = (options?: OptionsType): OPERATION<undefined> => ({
  service: 'vendedores',
  op: 'list',
  options,
});

const getVendedorOp = (
  id: ID,
  options?: OptionsType
): OPERATION<undefined> => ({
  service: 'vendedores',
  op: 'get',
  id,
  options,
});

const removeVendedorOp = (
  id: ID,
  options?: OptionsType
): OPERATION<undefined> => ({
  service: 'vendedores',
  op: 'remove',
  id,
  options,
});

export const apiListVendedores = (options?: OptionsType) =>
  apiFetch<undefined, Vendedor[]>(listVendedoresOp(options));

export const apiGetVendedor = (id: ID, options?: OptionsType) =>
  apiFetch<undefined, Vendedor>(getVendedorOp(id, options));

export const apiRemoveVendedor = (id: ID) =>
  apiFetch<undefined, null>(removeVendedorOp(id));
