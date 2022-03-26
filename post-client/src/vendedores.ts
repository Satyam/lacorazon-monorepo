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

export const apiCreateVendedor = (vendedor: Vendedor, options?: OptionsType) =>
  apiFetch<Vendedor, Vendedor>({
    service,
    op: 'create',
    id: 0,
    data: vendedor,
    options,
  });

export const apiUpdateVendedor = (vendedor: Vendedor, options?: OptionsType) =>
  apiFetch<Vendedor, Vendedor>({
    service,
    op: 'update',
    id: vendedor.id,
    data: vendedor,
    options,
  });

export const apiRemoveVendedor = (id: ID, options?: OptionsType) =>
  apiFetch<undefined, null>({
    service,
    op: 'remove',
    id,
    options,
  });
