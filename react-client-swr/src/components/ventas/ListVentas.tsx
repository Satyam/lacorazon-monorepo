import { ReactEventHandler } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import { useListVentas } from 'dataHooks/useVentas';
import { TableRowButtons, TableRowActionHandler } from 'components/Buttons';
import { IconAddtoCart, IconCheck } from '@lacorazon/lit-react-integration';
import Page from 'components/Page';
import { Loading } from 'components/Modals';
import { useModals } from 'providers/Modals';
import { formatCurrency, formatDate } from 'utils';

const ListVentas = ({ idVendedor }: { idVendedor?: ID }) => {
  const navigate = useNavigate();
  const { ventas, deleteVenta } = useListVentas();

  const { confirmDelete } = useModals();

  if (!ventas) return <Loading>Cargando ventas</Loading>;

  const onAdd: ReactEventHandler<HTMLButtonElement> = (ev) => {
    ev.stopPropagation();
    navigate(`/venta/new`);
  };

  const rowActionsHandler: TableRowActionHandler = (action, id, descr) => {
    switch (action) {
      case 'show':
        navigate(`/venta/${id}`);
        break;
      case 'edit':
        navigate(`/venta/edit/${id}`);
        break;
      case 'delete':
        confirmDelete(`la venta del ${descr}`, () => deleteVenta(id));
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
          <td title="Ver detalle del vendedor">
            <a href={`/vendedor/${venta.idVendedor}`}>{venta.vendedor}</a>
          </td>
        )}
        <td className="text-end">{venta.cantidad}</td>
        <td className="text-end">{formatCurrency(venta.precioUnitario)}</td>
        <td className="text-center">
          <IconCheck value={!!venta.iva}></IconCheck>
        </td>
        <td className="text-end">
          {formatCurrency((venta.cantidad || 0) * (venta.precioUnitario || 0))}
        </td>
        <td className="text-center">
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
      {ventas && (
        <Table striped hover size="sm" responsive bordered>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Concepto</th>
              {!idVendedor && <th className="idVendedor">Vendedor</th>}
              <th>Cantidad</th>
              <th>Precio Unitario</th>
              <th>IVA</th>
              <th>Precio Total</th>
              <th className="text-center">
                <Button onClick={onAdd} variant="primary" title="Agregar">
                  <IconAddtoCart>Agregar</IconAddtoCart>
                </Button>
              </th>
            </tr>
          </thead>
          <tbody>{ventas.map(rowVenta)}</tbody>
        </Table>
      )}
    </Page>
  );
};

export default ListVentas;
