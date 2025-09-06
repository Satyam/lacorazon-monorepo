import juris from '@src/jurisInstance.js';
import '@headless/Navigation.js';
import '@headless/DataApi.js';
import '@components/Buttons.js';
import '@components/ConfirmDelete.js';

import { formatDate, formatCurrency, iconCheck } from '@src/utils.js';

juris.registerComponent(
  'ListVentas',
  async ({ idVendedor }, { setState, DataApi, Navigation, components }) => {
    const confirmDelete = components.getComponentAPI('ConfirmDelete').confirm;
    const rowActionsHandler = (action, id, message) => {
      switch (action) {
        case 'show':
          Navigation.push(`/venta/${id}`);
          break;
        case 'edit':
          Navigation.push(`/venta/edit/${id}`);
          break;
        case 'delete':
          return confirmDelete(`la venta del ${message}`, id).then(
            ([result, id]) => {
              if (result === 'confirm') {
                return DataApi.removeVenta(id);
              }
            }
          );
          break;
      }
    };
    const rowVenta = (venta) => {
      const id = venta.id;
      return {
        tr: {
          key: id,
          children: [
            {
              td: {
                text: formatDate(venta.fecha),
              },
            },
            {
              td: {
                text: venta.concepto,
              },
            },
            () =>
              idVendedor
                ? null
                : {
                    td: {
                      title: 'Ver detalle del vendedor',
                      children: {
                        a: {
                          href: `./showVendedor/${venta.idVendedor}`,
                          onclick: (ev) => {
                            ev.preventDefault();
                            Navigation.push(
                              `./showVendedor/${venta.idVendedor}`
                            );
                          },
                          text: venta.vendedor,
                        },
                      },
                    },
                  },
            {
              td: {
                className: 'text-end',
                text: venta.cantidad,
              },
            },
            {
              td: {
                className: 'text-end',
                text: formatCurrency(venta.precioUnitario),
              },
            },
            {
              td: {
                className: 'text-center',
                children: iconCheck(!!venta?.iva),
              },
            },
            {
              td: {
                className: 'text-end',
                text: formatCurrency(
                  (venta.cantidad || 0) * (venta.precioUnitario || 0)
                ),
              },
            },
            {
              td: {
                className: 'text-center',
                children: {
                  TableRowButtons: {
                    action: rowActionsHandler,
                    id: venta.id,
                    message: formatDate(venta.fecha),
                  },
                },
              },
            },
          ],
        },
      };
    };
    const ventas = await DataApi.listVentas({ idVendedor });
    return {
      render: async () => {
        setState('title', 'Ventas');

        return {
          table: {
            className:
              'table table-striped table-hover table-sm table-responsive table-bordered',
            children: [
              {
                thead: {
                  children: [
                    {
                      tr: {
                        children: [
                          {
                            th: {
                              text: 'Fecha',
                            },
                          },

                          {
                            th: {
                              text: 'Concepto',
                            },
                          },

                          () =>
                            idVendedor
                              ? null
                              : {
                                  th: {
                                    className: 'idVendedor',
                                    text: 'Vendedor',
                                  },
                                },

                          {
                            th: {
                              text: 'Cantidad',
                            },
                          },

                          {
                            th: {
                              text: 'Precio Unitario',
                            },
                          },

                          {
                            th: {
                              text: 'IVA',
                            },
                          },

                          {
                            th: {
                              text: 'Precio Total',
                            },
                          },

                          {
                            th: {
                              className: 'text-center',
                              children: [
                                {
                                  button: {
                                    onClick: () =>
                                      Navigation.push('/ventas/new'),
                                    className: 'btn btn-primary',
                                    title: 'Agregar',
                                    children: {
                                      i: {
                                        className: 'bi bi-cart-plus',
                                        text: 'Agregar',
                                      },
                                    },
                                  },
                                },
                              ],
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },

              {
                tbody: {
                  children: () => ventas.map(rowVenta),
                  // onclick,
                },
              },
            ],
          },
        };
      },
    };
  }
);
