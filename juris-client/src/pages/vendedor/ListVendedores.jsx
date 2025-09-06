import juris from '@src/jurisInstance.js';
import '@headless/Navigation.js';
import '@headless/DataApi.js';
import { TableRowButtons } from '@components/Buttons.js';
import {
  CONFIRM_DELETE,
  CONFIRM_DELETE_RESULT,
  CONFIRM_DELETE_RESULT_CONFIRM,
} from '@components/ConfirmDelete.js';

juris.registerComponent(
  'ListVendedores',
  async (
    props,
    { getState, setState, subscribe, executeBatch, DataApi, Navigation }
  ) => {
    const rowActionsHandler = (action, id, message) => {
      switch (action) {
        case 'show':
          Navigation.push(`/vendedor/${id}`);
          break;
        case 'edit':
          Navigation.push(`/vendedor/edit/${id}`);
          break;
        case 'delete':
          setState(CONFIRM_DELETE, {
            message: `el vendedor ${message}`,
            id,
          });
          const unsubscribe = subscribe(
            CONFIRM_DELETE_RESULT,
            async (value) => {
              unsubscribe();
              if (value === CONFIRM_DELETE_RESULT_CONFIRM) {
                DataApi.removeVendedor(getState(`${CONFIRM_DELETE}.id`));
              }
              executeBatch(() => {
                setState(CONFIRM_DELETE, null);
              });
            }
          );
          break;
      }
    };
    const rowVendedor = (vendedor) => {
      const id = vendedor.id;
      return (
        <tr key={id}>
          <td>{vendedor.nombre}</td>
          <td>{vendedor.email}</td>
          <td class="text-center">
            <TableRowButtons
              action={rowActionsHandler}
              id={id}
              message={vendedor.nombre}
            />
          </td>
        </tr>
      );
    };
    const vendedores = await DataApi.listVendedores();
    return {
      render: async () => {
        setState('title', 'Vendedores');

        return (
          <table className="table table-striped table-hover table-sm table-responsive table-bordered">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>E-mail</th>
                <th class="text-center">
                  <button
                    onClick={() => Navigation.push('/ventas/new')}
                    className="btn btn-primary"
                    title="Agregar"
                  >
                    <i className="bi bi-person-plus-fill">Agregar</i>
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>{() => vendedores.map(rowVendedor)}</tbody>
          </table>
        );
      },
    };
  }
);
