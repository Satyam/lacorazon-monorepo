import apiFetch from './apiFetch';

export const VENDEDORES_SERVICE = 'vendedores';

export const apiListVendedores = (options?: OptionsType) =>
  apiFetch<undefined, undefined, Vendedor[]>({
    service: VENDEDORES_SERVICE,
    op: 'list',
    options,
  });

export const apiGetVendedor = (id: ID, options?: OptionsType) =>
  apiFetch<ID, undefined, Vendedor>({
    service: VENDEDORES_SERVICE,
    op: 'get',
    id,
    options,
  });

export const apiCreateVendedor = (vendedor: Vendedor, options?: OptionsType) =>
  apiFetch<undefined, Vendedor, Vendedor>({
    service: VENDEDORES_SERVICE,
    op: 'create',
    data: vendedor,
    options,
  });

export const apiUpdateVendedor = (vendedor: Vendedor, options?: OptionsType) =>
  apiFetch<ID, Vendedor, Vendedor>({
    service: VENDEDORES_SERVICE,
    op: 'update',
    id: vendedor.id,
    data: vendedor,
    options,
  });

export const apiRemoveVendedor = (id: ID, options?: OptionsType) =>
  apiFetch<ID, undefined, null>({
    service: VENDEDORES_SERVICE,
    op: 'remove',
    id,
    options,
  });
