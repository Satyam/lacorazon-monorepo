import apiFetch from './apiFetch';

export const VENTAS_SERVICE = 'ventas';
const ventasRequestConversion: RequestTransformer<Venta> = {
  fecha: (date) => date.toISOString(),
};

const ventasReplyConversion: ReplyTransformer<VentaYVendedor> = {
  fecha: (isoDate) => new Date(isoDate as string),
};

export const apiListVentas = (options?: OptionsType) =>
  apiFetch<undefined, VentaYVendedor[]>(
    {
      service: VENTAS_SERVICE,
      op: 'list',
      options,
    },
    undefined,
    ventasReplyConversion
  );

export const apiGetVenta = (id: ID, options?: OptionsType) =>
  apiFetch<undefined, VentaYVendedor>(
    {
      service: VENTAS_SERVICE,
      op: 'get',
      id,
      options,
    },
    undefined,
    ventasReplyConversion
  );

export const apiRemoveVenta = (id: ID, options?: OptionsType) =>
  apiFetch<undefined, null>({
    service: VENTAS_SERVICE,
    op: 'remove',
    id,
    options,
  });

export const apiCreateVenta = (venta: Venta, options?: OptionsType) =>
  apiFetch<Venta, Venta>(
    {
      service: VENTAS_SERVICE,
      op: 'create',
      id: 0,
      data: venta,
      options,
    },
    ventasRequestConversion,
    ventasReplyConversion
  );

export const apiUpdateVenta = (venta: Venta, options?: OptionsType) =>
  apiFetch<Venta, Venta>(
    {
      service: VENTAS_SERVICE,
      op: 'update',
      id: venta.id,
      data: venta,
      options,
    },
    ventasRequestConversion,
    ventasReplyConversion
  );
