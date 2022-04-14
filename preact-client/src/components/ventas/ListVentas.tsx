import { h, Fragment } from 'preact';
import { route } from 'preact-router';
import { Table, Alert, Button } from 'react-bootstrap';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import {
  apiListVentas,
  apiRemoveVenta,
  VENTAS_SERVICE,
} from '@lacorazon/post-client';
import { TableRowButtons, TableRowActionHandler } from 'components/Buttons';
import Page from 'components/Page';
import { Loading } from 'components/Modals';
import { useModals } from 'providers/Modals';
import { formatCurrency, formatDate } from 'utils';

const ListVentas = ({ idVendedor }: { idVendedor?: ID }) => {
  const errors: (Error | string)[] = [];
  const { isLoading, data: ventas } = useQuery<VentaYVendedor[], Error>(
    VENTAS_SERVICE,
    () => apiListVentas(),
    {
      onError: (error) => {
        errors.push(error);
      },
    }
  );

  const { openLoading, closeLoading, confirmDelete } = useModals();

  const queryClient = useQueryClient();

  const deleteVenta = useMutation<null, Error, ID>(apiRemoveVenta, {
    onMutate: () => openLoading('Borrando venta'),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(VENTAS_SERVICE);
    },
    onError: (error) => {
      errors.push(error);
    },
    onSettled: () => closeLoading(),
  });

  if (errors)
    return (
      <>
        {errors.map((error) => (
          <Alert variant="warning">{error.toString()}</Alert>
        ))}
      </>
    );
  if (isLoading) return <Loading>Cargando usuarios</Loading>;

  const onAdd: React.MouseEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    route(`/venta/new`);
  };

  const rowActionsHandler: TableRowActionHandler = (action, id, descr) => {
    switch (action) {
      case 'show':
        route(`/venta/${id}`);
        break;
      case 'edit':
        route(`/venta/edit/${id}`);
        break;
      case 'delete':
        confirmDelete(`la venta del ${descr}`, () => deleteVenta.mutate(id));
        break;
    }
  };

  const rowVenta = (venta: VentaYVendedor) => {
    const id = venta.id;
    return (
      <tr key={id}>
        <td>{formatDate(venta.fecha)}</td>
        <td>{venta.concepto}</td>
        {!idVendedor && (
          <td
            title="Ver detalle del vendedor"
            data-action="showVendedor"
            data-idVendedor={venta.idVendedor || 0}
          >
            <a href={`/vendedor/${venta.idVendedor}`}>{venta.vendedor}</a>
          </td>
        )}
        <td class="text-end">{venta.cantidad}</td>
        <td class="text-end">{formatCurrency(venta.precioUnitario)}</td>
        <td class="text-center">
          <icon-check value={!!venta?.iva}></icon-check>
        </td>
        <td class="text-end">
          {formatCurrency((venta.cantidad || 0) * (venta.precioUnitario || 0))}
        </td>
        <td class="text-center">
          <TableRowButtons
            onClick={rowActionsHandler}
            id={id}
            descr={formatDate(venta.fecha)}
          />
        </td>
      </tr>
    );
  };

  return (
    <Page title="Ventas" heading="Ventas" wide={!!idVendedor}>
      <Table striped hover size="sm" responsive bordered>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Concepto</th>
            {!idVendedor && <th class="idVendedor">Vendedor</th>}
            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>IVA</th>
            <th>Precio Total</th>
            <th class="text-center">
              <Button onClick={onAdd} variant="primary" title="Agregar">
                <icon-add-person>Agregar</icon-add-person>
              </Button>
            </th>
          </tr>
        </thead>
        <tbody>
          {(ventas || [])
            .filter((venta) => !idVendedor || venta.idVendedor === idVendedor)
            .map(rowVenta)}
        </tbody>
      </Table>
    </Page>
  );
};

export default ListVentas;