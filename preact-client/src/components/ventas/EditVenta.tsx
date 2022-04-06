import { h } from 'preact';
import { route } from 'preact-router';
import { useState } from 'preact/hooks';
import { Alert } from 'react-bootstrap';

import Page from 'components/Page';
import { DetailsButtonSet } from 'components/Buttons';
import { Loading } from 'components/Modals';
import { useModals } from 'providers/Modals';

import { formatDate } from 'utils';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  VENTAS_SERVICE,
  apiGetVenta,
  apiCreateVenta,
  apiUpdateVenta,
  apiRemoveVenta,
  VENDEDORES_SERVICE,
  apiListVendedores,
} from '@lacorazon/post-client';

import { FormSubmit } from '@lacorazon/lit-form';

export const EditVenta = ({ id }: { id: ID }) => {
  const { error: ventaError, data: venta } = useQuery<Venta, Error>(
    [VENTAS_SERVICE, id],
    () => apiGetVenta(id),
    {
      enabled: !!id,
    }
  );
  const { error: vendedoresError, data: vendedores } = useQuery<
    Vendedor[],
    Error
  >(VENDEDORES_SERVICE, () => apiListVendedores());

  const [error, setError] = useState<Error | null>(null);

  const queryClient = useQueryClient();

  const { openLoading, closeLoading, confirmDelete } = useModals();

  const deleteVenta = useMutation<null, Error, ID>(apiRemoveVenta, {
    onMutate: () => openLoading('Borrando venta'),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(VENTAS_SERVICE);
      route('/ventas', true);
    },
    onError: (error) => setError(error),
    onSettled: () => closeLoading(),
  });

  const createVenta = useMutation<Venta, Error, Venta>(apiCreateVenta, {
    onMutate: () => openLoading('Creando venta'),
    onSuccess: ({ id }) => {
      // Invalidate and refetch
      queryClient.invalidateQueries(VENTAS_SERVICE);
      route(`/venta/edit/${id}`, true);
    },
    onError: (error) => setError(error),
    onSettled: () => closeLoading(),
  });
  const updateVenta = useMutation<Venta, Error, Venta>(apiUpdateVenta, {
    onMutate: () => openLoading('Actualizando usuario'),
    onSuccess: () => {
      queryClient.invalidateQueries([VENTAS_SERVICE, id]);
    },
    onError: (error) => setError(error),
    onSettled: () => closeLoading(),
  });

  // All hooks executed, now I can branch
  if (ventaError) setError(ventaError);
  if (vendedoresError) setError(vendedoresError);

  if (error) return <Alert variant="warning">{error.toString()}</Alert>;
  if (!venta) return <Loading>Cargando venta</Loading>;
  if (!vendedores) return <Loading>Cargando vendedores</Loading>;

  const onDeleteClick = () => {
    if (!venta) return;
    confirmDelete(`la venta del ${formatDate(venta.fecha)}`, () =>
      deleteVenta.mutate(id)
    );
  };

  const onSubmit = (ev: FormSubmit) => {
    const { precioTotal, ...values } = ev.values;
    if (id) {
      updateVenta.mutate({ ...values, id });
    } else {
      createVenta.mutate({ ...values });
    }
  };

  return (
    <Page
      title={`Venta - ${venta ? formatDate(venta.fecha) : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Venta`}
    >
      {id && !venta ? (
        <Alert color="danger">El usuario no existe o fue borrado</Alert>
      ) : (
        <form-wrapper onformSubmit={onSubmit}>
          <date-field
            label="Fecha"
            name="fecha"
            value={venta.fecha}
          ></date-field>
          <text-field
            label="Concepto"
            name="concepto"
            value={venta.concepto || ''}
          ></text-field>
          <select-field
            label="Vendedor"
            name="idVendedor"
            labelFieldName="nombre"
            valueFieldName="id"
            nullLabel="--"
            options={vendedores as unknown as Record<string, VALUE>}
            value={String(venta.idVendedor)}
          ></select-field>
          <number-field
            label="Cantidad"
            name="cantidad"
            value={venta.cantidad || 0}
          ></number-field>
          <currency-field
            label="Precio Unitario"
            name="precioUnitario"
            value={venta.precioUnitario || 0}
          ></currency-field>
          <boolean-field
            checkLabel="IVA"
            name="iva"
            value={!!venta.iva}
          ></boolean-field>
          <currency-field
            label="Precio Total"
            name="precioTotal"
            value={(venta.cantidad || 0) * (venta.precioUnitario || 0)}
          ></currency-field>
          <DetailsButtonSet isNew={!id} onDelete={onDeleteClick} />
        </form-wrapper>
      )}
    </Page>
  );
};

export default EditVenta;
