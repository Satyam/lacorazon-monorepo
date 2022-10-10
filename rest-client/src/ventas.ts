import {
  apiCreate,
  apiDelete,
  apiGet,
  apiList,
  apiUpdate,
} from './apiFetch.js';

export const VENTAS_SERVICE = 'ventas';

type dbVenta = Omit<VentaYVendedor, 'fecha'> & { fecha: string };

const convertReq = (venta: Venta) =>
  ({ ...venta, fecha: venta.fecha.toISOString() } as dbVenta);

const convertRes = (venta: dbVenta) =>
  ({
    ...venta,
    fecha: new Date(venta.fecha),
  } as VentaYVendedor);

export const apiListVentas = (idVendedor?: ID) =>
  apiList<dbVenta[]>(
    VENTAS_SERVICE,
    idVendedor ? { idVendedor: String(idVendedor) } : undefined
  ).then((rows) => rows.map<VentaYVendedor>(convertRes));

export const apiGetVenta = (id: ID) =>
  apiGet<dbVenta>(VENTAS_SERVICE, id).then(convertRes);

export const apiCreateVenta = (venta: Venta) =>
  apiCreate<dbVenta>(VENTAS_SERVICE, convertReq(venta)).then(convertRes);

export const apiUpdateVenta = (id: ID, venta: Venta) =>
  apiUpdate<dbVenta>(VENTAS_SERVICE, id, convertReq(venta)).then(convertRes);

export const apiRemoveVenta = (id: ID) => apiDelete(VENTAS_SERVICE, id);
