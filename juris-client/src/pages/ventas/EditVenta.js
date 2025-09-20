import juris from '@src/jurisInstance.js';
import '@headless/DataApi.js';
import '@components/Forms.js';
import { formatDate, formatCurrency, datePart } from '@src/utils.js';

juris.registerComponent(
  'EditVenta',
  async ({ id, isNew }, { setState, DataApi }) => {
    const venta = isNew ? {} : await DataApi.getVenta(id);
    const vendedores = await DataApi.listVendedores();

    return {
      render: () => {
        setState('title', 'Venta');
        return {
          Form: {
            name: 'EditVenta',
            style: { maxWidth: '60em' },
            onsubmit: (values, ev) => {
              console.log(values);
            },
            onchange: (values, path) => {
              if (
                path.includes('.cantidad') ||
                path.includes('.precioUnitario')
              ) {
                return {
                  precioTotal: formatCurrency(
                    values.cantidad * values.precioUnitario
                  ),
                };
              }
            },
            children: [
              {
                TextField: {
                  name: 'fecha',
                  label: 'Fecha',
                  type: 'date',
                  value: datePart(isNew ? new Date() : venta.fecha),
                },
              },
              {
                TextField: {
                  name: 'concepto',
                  label: 'Concepto',
                  value: isNew ? '' : venta.concepto || '',
                },
              },
              {
                SelectField: {
                  name: 'idVendedor',
                  label: 'Vendedor',
                  value: isNew ? '' : venta.idVendedor,
                  options: vendedores,
                  valueFieldName: 'id',
                  labelFieldName: 'nombre',
                },
              },
              {
                TextField: {
                  name: 'cantidad',
                  label: 'Cantidad',
                  type: 'number',
                  step: 1,
                  value: isNew ? 1 : venta.cantidad || 1,
                },
              },
              {
                TextField: {
                  name: 'precioUnitario',
                  label: 'Precio Unitario',
                  type: 'number',
                  step: 0.01,
                  value: isNew ? 0 : venta.precioUnitario || 0,
                },
              },
              {
                CheckboxField: {
                  name: 'iva',
                  label: 'IVA',
                  value: isNew ? false : !!venta.iva,
                },
              },
              {
                TextField: {
                  name: 'precioTotal',
                  label: 'Precio Total',
                  value: () =>
                    formatCurrency(
                      (venta?.cantidad || 1) * (venta?.precioUnitario || 0)
                    ),
                  readonly: true,
                },
              },
              {
                SubmitButton: {
                  label: 'Aceptar',
                },
              },
            ],
          },
        };
      },
    };
  }
);
