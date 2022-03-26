import { FunctionComponent, h } from 'preact';
import { route } from 'preact-router';
import { Table, ButtonGroup, Alert } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiListVendedores, apiRemoveVendedor } from '@lacorazon/post-client';
import {
  ButtonIconAdd,
  ButtonIconEdit,
  ButtonIconDelete,
} from 'components/Icons';
import Page from 'components/Page';
import { Loading } from 'components/Modals';
import { useModals } from 'providers/Modals';

import { getTarget } from 'utils';

const VENDEDORES_KEY = 'vendedores';
const ListVendedores: FunctionComponent = () => {
  const {
    isLoading,
    isError,
    error,
    data: vendedores,
  } = useQuery<Vendedor[], Error>(VENDEDORES_KEY, () => apiListVendedores());
  const queryClient = useQueryClient();

  const deleteVendedor = useMutation<null, Error, ID>(apiRemoveVendedor, {
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(VENDEDORES_KEY);
    },
  });

  const { confirmDelete } = useModals();

  if (isError) return <Alert variant="warning">{error.message}</Alert>;
  if (isLoading) return <Loading>Cargando usuarios</Loading>;

  const onAdd = (ev: MouseEvent) => {
    ev.stopPropagation();
    route(`/vendedor/new`);
  };
  const onShow = (ev: MouseEvent) => {
    ev.stopPropagation();
    route(`/vendedor/${getTarget(ev).dataset.id}`);
  };
  const onDelete = (ev: MouseEvent) => {
    ev.stopPropagation();
    const { nombre, id } = getTarget(ev).dataset;
    if (id) {
      confirmDelete(`al usuario ${nombre}`, () => deleteVendedor.mutate(id));
    }
  };
  const onEdit = (ev: MouseEvent) => {
    ev.stopPropagation();
    route(`/vendedor/edit/${getTarget(ev).dataset.id}`);
  };

  const rowVendedor = (vendedor: Vendedor) => {
    const id = vendedor.id;
    return (
      <tr key={id}>
        <td
          onClick={onShow}
          data-id={id}
          className="link"
          title={`Ver detalles\n${vendedor.nombre}`}
        >
          {vendedor.nombre}
        </td>
        <td>{vendedor.email}</td>
        <td class="text-center">
          <ButtonGroup size="sm">
            <ButtonIconEdit
              // @ts-ignore
              onClick={onEdit}
              data-id={id}
            />
            <ButtonIconDelete
              // @ts-ignore
              onClick={onDelete}
              data-id={id}
              data-nombre={vendedor.nombre}
            />
          </ButtonGroup>
        </td>
      </tr>
    );
  };

  return (
    <Page title="Vendedores" heading="Vendedores">
      <Table striped hover size="sm" responsive bordered>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>E-mail</th>
            <th>
              <ButtonIconAdd
                // @ts-ignore
                onClick={onAdd}
              >
                Agregar
              </ButtonIconAdd>
            </th>
          </tr>
        </thead>
        <tbody>{(vendedores || []).map(rowVendedor)}</tbody>
      </Table>
    </Page>
  );
};

export default ListVendedores;
