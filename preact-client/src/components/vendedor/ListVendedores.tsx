import { h } from 'preact';
import { route } from 'preact-router';
import { Table, Alert, Button } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { apiListVendedores, apiRemoveVendedor } from '@lacorazon/post-client';
import { TableRowButtons, TableRowActionHandler } from 'components/Buttons';
import Page from 'components/Page';
import { Loading } from 'components/Modals';
import { useModals } from 'providers/Modals';

const VENDEDORES_KEY = 'vendedores';
const ListVendedores = () => {
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

  if (isError) return <Alert variant="warning">{error.toString()}</Alert>;
  if (isLoading) return <Loading>Cargando usuarios</Loading>;

  const onAdd = (ev: MouseEvent) => {
    ev.stopPropagation();
    route(`/vendedor/new`);
  };

  const rowActionsHandler: TableRowActionHandler = (action, id, descr) => {
    switch (action) {
      case 'show':
        route(`/vendedor/${id}`);
        break;
      case 'edit':
        route(`/vendedor/edit/${id}`);
        break;
      case 'delete':
        confirmDelete(`al usuario ${descr}`, () => deleteVendedor.mutate(id));
        break;
    }
  };

  const rowVendedor = (vendedor: Vendedor) => {
    const id = vendedor.id;
    return (
      <tr key={id}>
        <td>{vendedor.nombre}</td>
        <td>{vendedor.email}</td>
        <td class="text-center">
          <TableRowButtons
            onClick={rowActionsHandler}
            id={id}
            descr={vendedor.nombre}
          />
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
            <th class="text-center">
              <Button
                // @ts-ignore
                onClick={onAdd}
                variant="primary"
                title="Agregar"
              >
                <icon-add-person>Agregar</icon-add-person>
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>{(vendedores || []).map(rowVendedor)}</tbody>
      </Table>
    </Page>
  );
};

export default ListVendedores;
