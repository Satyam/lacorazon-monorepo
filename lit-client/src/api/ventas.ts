import { apiFetch, ApiService } from './apiService';
import { ReactiveControllerHost } from 'lit';

const removeVentaOp = (
  id: ID,
  options?: OptionsType
): OPERATION<undefined> => ({
  service: 'ventas',
  op: 'remove',
  id,
  options,
});

const getVentaOp = (id: ID, options?: OptionsType): OPERATION<undefined> => ({
  service: 'ventas',
  op: 'get',
  id,
  options,
});

const listVentasOp = (options?: OptionsType): OPERATION<undefined> => ({
  service: 'ventas',
  op: 'list',
  options,
});

const createVentaOp = (
  venta: Venta,
  options?: OptionsType
): OPERATION<Venta> => ({
  service: 'ventas',
  op: 'create',
  id: 0,
  data: venta,
  options,
});

const updateVentaOp = (
  id: ID,
  venta: Venta,
  options?: OptionsType
): OPERATION<Venta> => ({
  service: 'ventas',
  op: 'update',
  id,
  data: venta,
  options,
});

const ventasRequesConversion: RequestTransformer<Venta> = {
  fecha: (date) => date.toISOString(),
};

const ventasReplyConversion: ReplyTransformer<VentaYVendedor> = {
  fecha: (isoDate) => new Date(isoDate as string),
};

export class ApiTaskListVentas extends ApiService<undefined, VentaYVendedor[]> {
  constructor(host: ReactiveControllerHost, options?: OptionsType) {
    super(host, listVentasOp(options), undefined, ventasReplyConversion);
  }
}

export class ApiTaskGetVenta extends ApiService<undefined, VentaYVendedor> {
  constructor(host: ReactiveControllerHost, id: ID, options?: OptionsType) {
    super(host, getVentaOp(id, options), undefined, ventasReplyConversion);
  }
}

export const apiRemoveVenta = (id: ID, options?: OptionsType) =>
  apiFetch<undefined, null>(removeVentaOp(id, options));

export const apiCreateVenta = (venta: Venta, options?: OptionsType) =>
  apiFetch<Venta, Venta>(createVentaOp(venta, options), ventasRequesConversion);

export const apiUpdateVenta = (venta: Venta, options?: OptionsType) =>
  apiFetch<Venta, Venta>(
    updateVentaOp(venta.id, venta, options),
    ventasRequesConversion
  );
