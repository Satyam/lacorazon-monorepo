import juris from '@src/jurisInstance.js';
import '@headless/DataApi.js';

import {
  formatDate,
  formatCurrency,
  textField,
  checkboxField,
} from '@src/utils.js';

juris.registerComponent('ShowVenta', async ({ id }, { setState, DataApi }) => {
  const venta = await DataApi.getVenta(id);
  return {
    render: () => {
      setState('title', 'Venta');
      return {
        form: {
          children: [
            textField('fecha', 'Fecha', () => formatDate(venta.fecha)),
            textField('concepto', 'Concepto', () => venta.concepto || '', {
              readonly: true,
            }),
            textField('cantidad', 'Cantidad', () => venta.cantidad || 0, {
              readonly: true,
            }),
            textField(
              'precioUnitario',
              'Precio Unitario',
              () => formatCurrency(venta.precioUnitario || 0),
              { readonly: true }
            ),
            checkboxField('iva', 'IVA', !!venta.iva, { readonly: true }),
            textField(
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
