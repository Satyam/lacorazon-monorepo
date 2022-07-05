import { useNavigate } from 'react-router-dom';
import { Alert } from 'react-bootstrap';

import Page from 'components/Page';
import { DetailsButtonSet } from 'components/Buttons';
import { Loading } from 'components/Modals';
import { useModals } from 'providers/Modals';

import { formatDate } from 'utils';

import { useGetVenta } from 'dataHooks/useVentas';
import { useListVendedores } from 'dataHooks/useVendedores';

import {
  FormWrapper,
  FormSubmitEvent,
  DateField,
  TextField,
  SelectField,
  NumberField,
  CurrencyField,
  BooleanField,
} from '@lacorazon/lit-form-react';

export const EditVenta = ({ id }: { id: ID }) => {
  const navigate = useNavigate();
  const { venta, createVenta, updateVenta, deleteVenta } = useGetVenta(id);

  const { vendedores } = useListVendedores();

  const { confirmDelete } = useModals();

  // All hooks executed, now I can branch
  if (!venta) return <Loading>Cargando venta</Loading>;
  if (!vendedores) return <Loading>Cargando ventas</Loading>;

  const onDeleteClick = () => {
    if (!venta) return;
    confirmDelete(`la venta del ${formatDate(venta.fecha)}`, () =>
      deleteVenta().then(() => navigate('/ventas', { replace: true }))
    );
  };

  const onSubmit = (ev: FormSubmitEvent) => {
    const { precioTotal, ...values } = ev.values;
    if (id) {
      updateVenta({ ...values, id });
    } else {
      createVenta({ ...values }).then(({ id }) =>
        navigate(`/venta/edit/${id}`, { replace: true })
      );
    }
  };
  return (
    <Page
      title={`Venta - ${venta ? formatDate(venta.fecha) : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Venta`}
    >
      {venta ? (
        <FormWrapper onFormSubmit={onSubmit}>
          <DateField label="Fecha" name="fecha" value={venta.fecha}></DateField>
          <TextField label="Concepto" name="concepto" value={venta.concepto} />
          <SelectField
            label="Vendedor"
            name="idVendedor"
            labelFieldName="nombre"
            valueFieldName="id"
            nullLabel="--"
            options={vendedores as unknown as AnyRow[]}
            value={String(venta.idVendedor)}
          />
          <NumberField
            label="Cantidad"
            name="cantidad"
            value={venta.cantidad}
          />
          <CurrencyField
            label="Precio Unitario"
            name="precioUnitario"
            value={venta.precioUnitario}
          />
          <BooleanField checkLabel="IVA" name="iva" value={!!venta.iva} />
          <CurrencyField
            label="Precio Total"
            name="precioTotal"
            value={(venta.cantidad || 0) * (venta.precioUnitario || 0)}
          />
          <DetailsButtonSet isNew={!id} onDelete={onDeleteClick} />
        </FormWrapper>
      ) : id ? (
        <Alert color="danger">El usuario no existe o fue borrado</Alert>
      ) : null}
    </Page>
  );
};

export default EditVenta;
