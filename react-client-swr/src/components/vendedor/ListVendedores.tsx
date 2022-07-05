import { ReactEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { useListVendedores } from 'dataHooks/useVendedores';
import { TableRowButtons, TableRowActionHandler } from 'components/Buttons';
import Page from 'components/Page';
import { Loading } from 'components/Modals';
import { useModals } from 'providers/Modals';

const ListVendedores = () => {
  const navigate = useNavigate();
  const { vendedores, deleteVendedor } = useListVendedores();

  const { confirmDelete } = useModals();

  if (!vendedores) return <Loading>Cargando vendedores</Loading>;

  const onAdd: ReactEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    navigate(`/vendedor/new`);
  };

  const rowActionsHandler: TableRowActionHandler = (action, id, descr) => {
    switch (action) {
      case 'show':
        navigate(`/vendedor/${id}`);
        break;
      case 'edit':
        navigate(`/vendedor/edit/${id}`);
        break;
      case 'delete':
        confirmDelete(`al usuario ${descr}`, () => deleteVendedor(id));
        break;
    }
  };

  const rowVendedor = (vendedor: Vendedor) => {
    const id = vendedor.id;
    return (
      <tr key={id}>
        <td>{vendedor.nombre}</td>
        <td>{vendedor.email}</td>
        <td className="text-center">
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
      {vendedores && (
        <Table striped hover size="sm" responsive bordered>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>E-mail</th>
              <th className="text-center">
                <Button onClick={onAdd} variant="primary" title="Agregar">
                  <icon-add-person>Agregar</icon-add-person>
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>{(vendedores || []).map(rowVendedor)}</tbody>
        </Table>
      )}
    </Page>
  );
};

export default ListVendedores;
