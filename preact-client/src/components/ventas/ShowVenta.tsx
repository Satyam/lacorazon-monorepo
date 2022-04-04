import { h } from 'preact';
import { Alert } from 'react-bootstrap';

import Page from 'components/Page';
import { Loading } from 'components/Modals';

import { useQuery } from 'react-query';
import { apiGetVenta } from '@lacorazon/post-client';

import { formatDate } from 'utils';

const ShowVenta = ({ id }: { id: ID }) => {
  const {
    isLoading,
    isError,
    error,
    data: venta,
  } = useQuery<VentaYVendedor, Error>(['venta', id], () => apiGetVenta(id));

  if (isError) return <Alert variant="warning">{error.toString()}</Alert>;
  if (isLoading) return <Loading>Cargando venta</Loading>;

  return (
    <Page
      title={`Venta - ${venta ? formatDate(venta.fecha) : '??'}`}
      heading={`Venta`}
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
