import { h } from 'preact';

import Page from 'components/Page';
import { Loading } from 'components/Modals';

import { useQuery } from 'react-query';
import { apiGetVenta, VENTAS_SERVICE } from '@lacorazon/post-client';

import { formatDate } from 'utils';

const ShowVenta = ({ id }: { id: ID }) => {
  const {
    isLoading,
    error,
    data: venta,
  } = useQuery<VentaYVendedor, Error>([VENTAS_SERVICE, id], () =>
    apiGetVenta(id)
  );

  if (isLoading) return <Loading>Cargando venta</Loading>;

  return (
    <Page
      title={`Venta - ${venta ? formatDate(venta.fecha) : '??'}`}
      heading={`Venta`}
      error={error}
    >
      <form-wrapper>
        <date-field
          label="Fecha"
          name="fecha"
          value={venta?.fecha}
          readonly
        ></date-field>
        <text-field
          label="Concepto"
          name="concepto"
          value={venta?.concepto || ''}
          readonly
        ></text-field>
        <text-field
          label="Vendedor"
          name="vendedor"
          value={venta?.vendedor || '-'}
          readonly
        ></text-field>
        <number-field
          label="Cantidad"
          name="cantidad"
          value={venta?.cantidad || 0}
          readonly
        ></number-field>
        <currency-field
          label="Precio Unitario"
          name="precioUnitario"
          value={venta?.precioUnitario || 0}
          readonly
        ></currency-field>
        <boolean-field
          checkLabel="IVA"
          name="iva"
          value={!!venta?.iva}
          readonly
        ></boolean-field>
        <currency-field
          label="Precio Total"
          name="precioTotal"
          value={(venta?.cantidad || 0) * (venta?.precioUnitario || 0)}
          readonly
        ></currency-field>
      </form-wrapper>
    </Page>
  );
};

export default ShowVenta;
