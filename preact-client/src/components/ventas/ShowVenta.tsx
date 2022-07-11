import { h } from 'preact';

import Page from 'components/Page';
import { Loading } from 'components/Modals';

import { useQuery } from 'react-query';
import { apiGetVenta, VENTAS_SERVICE } from '@lacorazon/post-client';
import {
  FormWrapper,
  DateField,
  TextField,
  NumberField,
  CurrencyField,
  BooleanField,
} from '@lacorazon/lit-react-integration';
import { formatDate } from 'utils';

const ShowVenta = ({ id }: { id: ID }) => {
  const { isLoading, data: venta } = useQuery<VentaYVendedor, Error>(
    [VENTAS_SERVICE, id],
    () => apiGetVenta(id),
    { meta: { message: `Mostrando venta ${id}` } }
  );

  if (isLoading) return <Loading>Cargando venta</Loading>;

  return (
    <Page
      title={`Venta - ${venta ? formatDate(venta.fecha) : '??'}`}
      heading={`Venta`}
    >
      <FormWrapper>
        <DateField
          label="Fecha"
          name="fecha"
          value={venta?.fecha}
          readonly
        ></DateField>
        <TextField
          label="Concepto"
          name="concepto"
          value={venta?.concepto || ''}
          readonly
        ></TextField>
        <TextField
          label="Vendedor"
          name="vendedor"
          value={venta?.vendedor || '-'}
          readonly
        ></TextField>
        <NumberField
          label="Cantidad"
          name="cantidad"
          value={venta?.cantidad || 0}
          readonly
        ></NumberField>
        <CurrencyField
          label="Precio Unitario"
          name="precioUnitario"
          value={venta?.precioUnitario || 0}
          readonly
        ></CurrencyField>
        <BooleanField
          checkLabel="IVA"
          name="iva"
          value={!!venta?.iva}
          readonly
        ></BooleanField>
        <CurrencyField
          label="Precio Total"
          name="precioTotal"
          value={(venta?.cantidad || 0) * (venta?.precioUnitario || 0)}
          readonly
        ></CurrencyField>
      </FormWrapper>
    </Page>
  );
};

export default ShowVenta;
