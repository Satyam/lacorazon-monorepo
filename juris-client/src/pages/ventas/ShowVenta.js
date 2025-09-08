import juris from '@src/jurisInstance.js';
import '@headless/DataApi.js';

import { formatDate, formatCurrency, iconCheck } from '@src/utils.js';

juris.registerComponent('ShowVenta', async ({ id }, { setState, DataApi }) => {
  const field = (name, label, value, other = {}) => ({
    div: {
      className: 'mb-3 row',
      children: [
        {
          label: {
            for: `showVenta${name}`,
            className: 'col-sm-2 col-form-label',
            text: label,
          },
        },
        {
          div: {
            className: 'col-sm-10',
            children: {
              input: {
                name,
                type: 'text',
                className: 'form-control',
                id: `showVenta${name}`,
                value,
                ...other,
              },
            },
          },
        },
      ],
    },
  });

  const checkbox = (name, label, value, other = {}) => ({
    div: {
      className: 'row mb-3',
      children: {
        div: {
          className: 'col-sm-10 offset-sm-2',
          children: {
            div: {
              className: 'form-check',
              children: () =>
                other.readonly
                  ? iconCheck(value, 'IVA')
                  : [
                      {
                        input: {
                          name,
                          className: 'form-check-input',
                          type: 'checkbox',
                          id: `showVenta${name}`,
                          checked: value,
                          ...other,
                        },
                      },
                      {
                        label: {
                          className: 'form-check-label',
                          for: `showVenta${name}`,
                          text: label,
                        },
                      },
                    ],
            },
          },
        },
      },
    },
  });
  const venta = await DataApi.getVenta(id);
  return {
    render: () => {
      setState('title', 'Venta');
      return {
        form: {
          children: [
            field('fecha', 'Fecha', () => formatDate(venta.fecha)),
            field('concepto', 'Concepto', () => venta.concepto || '', {
              readonly: true,
            }),
            field('cantidad', 'Cantidad', () => venta.cantidad || 0, {
              readonly: true,
            }),
            field(
              'precioUnitario',
              'Precio Unitario',
              () => formatCurrency(venta.precioUnitario || 0),
              { readonly: true }
            ),
            checkbox('iva', 'IVA', !!venta.iva, { readonly: true }),
            field(
              'precioTotal',
              'Precio Total',
              () =>
                formatCurrency(
                  (venta?.cantidad || 0) * (venta?.precioUnitario || 0)
                ),
              { readonly: true }
            ),
          ],
        },
      };
    },
  };
});
