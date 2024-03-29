import Page from 'components/Page';
import { Loading } from 'components/Modals';

import { useGetVenta } from 'dataHooks/useVentas';
import {
  FormWrapper,
  DateField,
  TextField,
  NumberField,
  CurrencyField,
  BooleanField,
} from '@lacorazon/lit-react-integration';

import { formatDate } from 'utils';
import { useNavigate } from 'react-router-dom';

const ShowVenta = ({ id }: { id: ID }) => {
  const { venta } = useGetVenta(id);
  const navigate = useNavigate();

  if (!venta) return <Loading>Cargando venta</Loading>;

  return (
    <Page
      title={`Venta - ${venta ? formatDate(venta.fecha) : '??'}`}
      heading={`Venta`}
      onClose={() => {
        navigate('/ventas', { replace: true });
      }}
    >
      <FormWrapper>
        <form>
          <DateField label="Fecha" name="fecha" value={venta?.fecha} readonly />
          <TextField
            label="Concepto"
            name="concepto"
            value={venta?.concepto || ''}
            readonly
          />
          <TextField
            label="Vendedor"
            name="vendedor"
            value={venta?.vendedor || '-'}
            readonly
          />
          <NumberField
            label="Cantidad"
            name="cantidad"
            value={venta?.cantidad || 0}
            readonly
          />
          <CurrencyField
            label="Precio Unitario"
            name="precioUnitario"
            value={venta?.precioUnitario || 0}
            readonly
          />
          <BooleanField
            checkLabel="IVA"
            name="iva"
            checked={!!venta?.iva}
            readonly
          />
          <CurrencyField
            label="Precio Total"
            name="precioTotal"
            value={(venta?.cantidad || 0) * (venta?.precioUnitario || 0)}
            readonly
          />
        </form>
      </FormWrapper>
    </Page>
  );
};

export default ShowVenta;
