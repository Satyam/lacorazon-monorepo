import { h } from 'preact';
import { route } from 'preact-router';
import { useState } from 'preact/hooks';
import { Alert } from 'react-bootstrap';

import Page from 'components/Page';
import { DetailsButtonSet } from 'components/Buttons';
import { Loading } from 'components/Modals';
import { useModals } from 'providers/Modals';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  VENDEDORES_SERVICE,
  apiGetVendedor,
  apiCreateVendedor,
  apiUpdateVendedor,
  apiRemoveVendedor,
} from '@lacorazon/post-client';

import { FormSubmit } from '@lacorazon/lit-form';

export const EditVendedor = ({ id }: { id: ID }) => {
  const {
    isLoading,
    isError,
    error: fetchError,
    data: vendedor,
  } = useQuery<Vendedor, Error>(
    [VENDEDORES_SERVICE, id],
    () => apiGetVendedor(id),
    { enabled: !!id }
  );

  const [error, setError] = useState<Error | null>(null);

  const queryClient = useQueryClient();

  const deleteVendedor = useMutation<null, Error, ID>(apiRemoveVendedor, {
    onMutate: () => openLoading('Borrando vendedor'),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(VENDEDORES_SERVICE);
      route('/vendedores', true);
    },
    onError: (error) => setError(error),
    onSettled: () => closeLoading(),
  });

  const createVendedor = useMutation<Vendedor, Error, Vendedor>(
    apiCreateVendedor,
    {
      onMutate: () => openLoading('Creando vendedor'),
      onSuccess: ({ id }) => {
        // Invalidate and refetch
        queryClient.invalidateQueries(VENDEDORES_SERVICE);
        route(`/vendedor/edit/${id}`, true);
      },
      onError: (error) => setError(error),
      onSettled: () => closeLoading(),
    }
  );
  const updateVendedor = useMutation<Vendedor, Error, Vendedor>(
    apiUpdateVendedor,
    {
      onMutate: () => openLoading('Actualizando usuario'),
      onSuccess: () => {
        queryClient.invalidateQueries([VENDEDORES_SERVICE, id]);
      },
      onError: (error) => setError(error),
      onSettled: () => closeLoading(),
    }
  );
  const { openLoading, closeLoading, confirmDelete } = useModals();

  // All hooks executed, now I can branch
  if (isError) setError(fetchError);

  if (error) return <Alert variant="warning">{error.toString()}</Alert>;
  if (isLoading) return <Loading>Cargando vendedor</Loading>;

  const onDeleteClick = () => {
    confirmDelete(`al usuario ${vendedor?.nombre}`, () =>
      deleteVendedor.mutate(id)
    );
  };

  const onSubmit = (ev: FormSubmit) => {
    const values = ev.values;
    if (id) {
      updateVendedor.mutate({ ...values, id });
    } else {
      createVendedor.mutate({ ...values });
    }
  };

  return (
    <Page
      title={`Vendedor - ${vendedor ? vendedor.nombre : 'nuevo'}`}
      heading={`${id ? 'Edit' : 'Add'} Vendedor`}
    >
      {id && !vendedor ? (
        <Alert color="danger">El usuario no existe o fue borrado</Alert>
      ) : (
        <form-wrapper onformSubmit={onSubmit}>
          <text-field
            label="Nombre"
            name="nombre"
            value={vendedor?.nombre}
            placeholder="Nombre"
          />
          <email-field
            label="Email"
            name="email"
            value={vendedor?.email || '-'}
            placeholder="Email"
          />
          <DetailsButtonSet isNew={!id} onDelete={onDeleteClick} />
        </form-wrapper>
      )}
    </Page>
  );
};

export default EditVendedor;
