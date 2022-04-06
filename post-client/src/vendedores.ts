import apiFetch from './apiFetch';

export const VENDEDORES_SERVICE = 'vendedores';

export const apiListVendedores = (options?: OptionsType) =>
  apiFetch<undefined, Vendedor[]>({
    service: VENDEDORES_SERVICE,
    op: 'list',
    options,
  });

export const apiGetVendedor = (id: ID, options?: OptionsType) =>
  apiFetch<undefined, Vendedor>({
    service: VENDEDORES_SERVICE,
    op: 'get',
    id,
    options,
  });

export const apiCreateVendedor = (vendedor: Vendedor, options?: OptionsType) =>
  apiFetch<Vendedor, Vendedor>({
    service: VENDEDORES_SERVICE,
    op: 'create',
    id: 0,
    data: vendedor,
    options,
  });

export const apiUpdateVendedor = (vendedor: Vendedor, options?: OptionsType) =>
  apiFetch<Vendedor, Vendedor>({
    service: VENDEDORES_SERVICE,
    op: 'update',
    id: vendedor.id,
    data: vendedor,
    options,
  });

export const apiRemoveVendedor = (id: ID, options?: OptionsType) =>
  apiFetch<undefined, null>({
    service: VENDEDORES_SERVICE,
    op: 'remove',
    id,
    options,
  });
