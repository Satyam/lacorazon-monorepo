import { h } from 'preact';
import { route } from 'preact-router';
import { Alert } from 'react-bootstrap';

import Page from 'components/Page';
import { DetailsButtonSet } from 'components/Buttons';
import { Loading } from 'components/Modals';
import { useModals } from 'providers/Modals';

import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  apiGetVendedor,
  apiCreateVendedor,
  apiUpdateVendedor,
  apiRemoveVendedor,
} from '@lacorazon/post-client';

import { FormSubmit } from '@lacorazon/lit-form';

const VENDEDORES_KEY = 'vendedores';

export const EditVendedor = ({ id }: { id: ID }) => {
  const {
    isLoading,
    isError,
    error,
    data: vendedor,
  } = useQuery<Vendedor, Error>(
    [VENDEDORES_KEY, id],
    () => apiGetVendedor(id),
    { enabled: !!id }
  );
  const queryClient = useQueryClient();

  const deleteVendedor = useMutation<null, Error, ID>(apiRemoveVendedor, {
    onMutate: () => {
      openLoading('Borrando vendedor');
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(VENDEDORES_KEY);
      route('/vendedores', true);
    },
    onError: (error, id) => {
      console.error('on:', id, 'error:', error.message);
    },
    onSettled: () => {
      closeLoading();
    },
  });

  const createVendedor = useMutation<Vendedor, Error, Vendedor>(
    apiCreateVendedor,
    {
      onMutate: () => {
        openLoading('Creando vendedor');
      },
      onSuccess: ({ id }) => {
        // Invalidate and refetch
        queryClient.invalidateQueries(VENDEDORES_KEY);
        route(`/vendedor/edit/${id}`, true);
      },
      onError: (error, vendedor) => {
        console.error('Error on create:', error.message, vendedor);
      },
      onSettled: () => {
        closeLoading();
      },
    }
  );
  const updateVendedor = useMutation<Vendedor, Error, Vendedor>(
    apiUpdateVendedor,
    {
      onMutate: () => {
        openLoading('Actualizando usuario');
      },
      onSuccess: () => {
        queryClient.invalidateQueries([VENDEDORES_KEY, id]);
      },
      onError: (error, vendedor) => {
        console.error('Error on update:', error.message, vendedor);
      },
      onSettled: () => {
        closeLoading();
      },
    }
  );
  const { openLoading, closeLoading, confirmDelete } = useModals();

  if (isError) return <Alert variant="warning">{error.message}</Alert>;
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
