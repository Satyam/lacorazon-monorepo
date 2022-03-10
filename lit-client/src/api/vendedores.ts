import { apiFetch, ApiService } from './apiService';
import { ReactiveControllerHost } from 'lit';

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

export class ApiTaskListVendedores extends ApiService<undefined, Vendedor> {
  constructor(host: ReactiveControllerHost, options?: OptionsType) {
    super(host, listVendedoresOp(options));
  }
}

export class ApiTaskGetVendedor extends ApiService<undefined, Vendedor> {
  constructor(host: ReactiveControllerHost, id: ID, options?: OptionsType) {
    super(host, getVendedorOp(id, options));
  }
}
export const apiRemoveVendedor = (id: ID) => apiFetch(removeVendedorOp(id));
