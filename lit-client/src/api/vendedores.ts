import apiFetch from './apiFetch';

const service = 'vendedores';

export const apiListVendedores = (options?: OptionsType) =>
  apiFetch<undefined, Vendedor[]>({
    service,
    op: 'list',
    options,
  });

export const apiGetVendedor = (id: ID, options?: OptionsType) =>
  apiFetch<undefined, Vendedor>({
    service,
    op: 'get',
    id,
    options,
  });

export const apiRemoveVendedor = (id: ID, options?: OptionsType) =>
  apiFetch<undefined, null>({
    service,
    op: 'remove',
    id,
    options,
  });
