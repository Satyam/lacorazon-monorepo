import juris from '@src/juris.js';
import '@headless/DataFetch.js';

const AUTH_SERVICE = 'auth';
const VENDEDORES_SERVICE = 'vendedores';
const VENTAS_SERVICE = 'ventas';

const GET = 'get';
const LIST = 'list';
const CREATE = 'create';
const UPDATE = 'update';
const REMOVE = 'remove';

const ventasRequestConversion = {
  fecha: (date) => date.toISOString(),
};

const ventasReplyConversion = {
  fecha: (isoDate) => new Date(isoDate),
};

juris.registerHeadlessComponent(
  'DataApi',
  (props, { DataFetch }) => ({
    api: {
      login: (data, options) =>
        DataFetch.fetch({
          service: AUTH_SERVICE,
          op: 'login',
          data,
          options,
        }),

      logout: (options) =>
        DataFetch.fetch({
          service: AUTH_SERVICE,
          op: 'logout',
          options,
        }),

      isLoggedIn: (options) =>
        DataFetch.fetch({
          service: AUTH_SERVICE,
          op: 'isLoggedIn',
          options,
        }),

      listVendedores: (options) =>
        DataFetch.fetch({
          service: VENDEDORES_SERVICE,
          op: LIST,
          options,
        }),

      getVendedor: (id, options) =>
        DataFetch.fetch({
          service: VENDEDORES_SERVICE,
          op: GET,
          id,
          options,
        }),

      createVendedor: (vendedor, options) =>
        DataFetch.fetch({
          service: VENDEDORES_SERVICE,
          op: CREATE,
          data: vendedor,
          options,
        }),

      updateVendedor: (vendedor, options) =>
        DataFetch.fetch({
          service: VENDEDORES_SERVICE,
          op: UPDATE,
          id: vendedor.id,
          data: vendedor,
          options,
        }),

      removeVendedor: (id, options) =>
        DataFetch.fetch({
          service: VENDEDORES_SERVICE,
          op: REMOVE,
          id,
          options,
        }),
      listVentas: (options) =>
        DataFetch.fetch(
          {
            service: VENTAS_SERVICE,
            op: LIST,
            options,
          },
          undefined,
          ventasReplyConversion
        ),

      getVenta: (id, options) =>
        DataFetch.fetch(
          {
            service: VENTAS_SERVICE,
            op: GET,
            id,
            options,
          },
          undefined,
          ventasReplyConversion
        ),

      removeVenta: (id, options) =>
        DataFetch.fetch({
          service: VENTAS_SERVICE,
          op: REMOVE,
          id,
          options,
        }),

      createVenta: (venta, options) =>
        DataFetch.fetch(
          {
            service: VENTAS_SERVICE,
            op: CREATE,
            data: venta,
            options,
          },
          ventasRequestConversion,
          ventasReplyConversion
        ),

      updateVenta: (venta, options) =>
        DataFetch.fetch(
          {
            service: VENTAS_SERVICE,
            op: UPDATE,
            id: venta.id,
            data: venta,
            options,
          },
          ventasRequestConversion,
          ventasReplyConversion
        ),
    },
  }),
  { autoInit: true }
);
