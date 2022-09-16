import {
  apiCreate,
  apiDelete,
  apiGet,
  apiList,
  apiUpdate,
} from './apiFetch.js';

export const VENDEDORES_SERVICE = 'vendedores';

export const apiListVendedores = () => apiList<Vendedor[]>(VENDEDORES_SERVICE);

export const apiGetVendedor = (id: ID) =>
  apiGet<Vendedor>(VENDEDORES_SERVICE, id);

export const apiCreateVendedor = (vendedor: Vendedor) =>
  apiCreate<Vendedor>(VENDEDORES_SERVICE, vendedor);

export const apiUpdateVendedor = (id: ID, vendedor: Vendedor) =>
  apiUpdate<Vendedor>(VENDEDORES_SERVICE, id, vendedor);

export const apiRemoveVendedor = (id: ID) => apiDelete(VENDEDORES_SERVICE, id);
