import juris from '@src/jurisInstance.js';
import '@headless/DataApi.js';
import '@components/Forms.js';
import { formatDate, formatCurrency } from '@src/utils.js';

juris.registerComponent('ShowVenta', async ({ id }, { setState, DataApi }) => {
  const venta = await DataApi.getVenta(id);
  return {
    render: () => {
      setState('title', 'Venta');
      return {
        Form: {
          name: 'ShowVenta',
          children: [
            {
              TextField: {
                name: 'fecha',
                label: 'Fecha',
                value: formatDate(venta.fecha),
                readonly: true,
              },
            },
            {
              TextField: {
                name: 'concepto',
                label: 'Concepto',
                value: venta.concepto || '',
                readonly: true,
              },
            },
            {
              TextField: {
                name: 'cantidad',
                label: 'Cantidad',
                value: venta.cantidad || 0,
                readonly: true,
              },
            },
            {
              TextField: {
                name: 'precioUnitario',
                label: 'Precio Unitario',
                value: formatCurrency(venta.precioUnitario || 0),
                readonly: true,
              },
            },
            {
              CheckboxField: {
                name: 'iva',
                label: 'IVA',
                value: !!venta.iva,
                readonly: true,
              },
            },
            {
              TextField: {
                name: 'precioTotal',
                label: 'Precio Total',
                value: formatCurrency(
                  (venta?.cantidad || 0) * (venta?.precioUnitario || 0)
                ),
                readonly: true,
              },
            },
          ],
        },
      };
    },
  };
});
