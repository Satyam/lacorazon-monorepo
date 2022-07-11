import { h } from 'preact';
import { route } from 'preact-router';
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

import {
  FormWrapper,
  FormSubmitEvent,
  TextField,
  EmailField,
} from '@lacorazon/lit-react-integration';

export const EditVendedor = ({ id }: { id: ID }) => {
  const { isLoading, data: vendedor } = useQuery<Vendedor, Error>(
    [VENDEDORES_SERVICE, id],
    () => apiGetVendedor(id),
    {
      enabled: !!id,
      meta: { message: id ? `Modificar Vendedor ${id}` : 'Agregar Vendedor' },
    }
  );

  const queryClient = useQueryClient();

  const deleteVendedor = useMutation<null, Error, ID>(apiRemoveVendedor, {
    onMutate: () => openLoading('Borrando vendedor'),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(VENDEDORES_SERVICE);
      route('/vendedores', true);
    },
    meta: { message: `Borrar Vendedor ${id}` },
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
      meta: { message: 'Crear Vendedor' },
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
      meta: { message: `Actualizando Vendedor ${id}` },
      onSettled: () => closeLoading(),
    }
  );
  const { openLoading, closeLoading, confirmDelete } = useModals();

  // All hooks executed, now I can branch
  if (isLoading) return <Loading>Cargando vendedor</Loading>;

  const onDeleteClick = () => {
    confirmDelete(`al usuario ${vendedor?.nombre}`, () =>
      deleteVendedor.mutate(id)
    );
  };

  const onSubmit = (ev: FormSubmitEvent) => {
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
        <FormWrapper onFormSubmit={onSubmit}>
          <TextField
            label="Nombre"
            name="nombre"
            value={vendedor?.nombre}
            placeholder="Nombre"
          />
          <EmailField
            label="Email"
            name="email"
            value={vendedor?.email || '-'}
            placeholder="Email"
          />
          <DetailsButtonSet isNew={!id} onDelete={onDeleteClick} />
        </FormWrapper>
      )}
    </Page>
  );
};

export default EditVendedor;
