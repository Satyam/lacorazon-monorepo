import { h, Fragment } from 'preact';
import { Button, ButtonGroup } from 'react-bootstrap';

type RowActions = 'show' | 'edit' | 'delete';
export type TableRowActionHandler = (
  action: RowActions,
  id: ID,
  nombre: string
) => void;

export const TableRowButtons = ({
  onClick,
  id,
  nombre,
}: {
  onClick: TableRowActionHandler;
  id: ID;
  nombre: string;
}) => {
  const act = (action: RowActions) => (ev: { preventDefault: () => void }) => {
    ev.preventDefault();
    onClick(action, id, nombre);
  };
  return (
    <ButtonGroup size="sm">
      <Button variant="outline-info" title="Ver detalle" onClick={act('show')}>
        <icon-show></icon-show>
      </Button>
      <Button
        variant="outline-secondary"
        title="Modificar"
        onClick={act('edit')}
      >
        <icon-edit></icon-edit>
      </Button>
      <Button variant="outline-danger" title="Borrar" onClick={act('delete')}>
        <icon-trash></icon-trash>
      </Button>
    </ButtonGroup>
  );
};

export const DetailsButtonSet = ({
  onDelete,
  isNew,
}: {
  onDelete: () => void;
  isNew: boolean;
}) => {
  const act = (ev: { preventDefault: () => void }) => {
    ev.preventDefault();
    onDelete();
  };
  return isNew ? (
    <Button variant="primary" type="submit">
      <icon-add>Agregar</icon-add>
    </Button>
  ) : (
    <>
      <Button variant="primary" type="submit">
        <icon-edit>Modificar</icon-edit>
      </Button>
      <Button variant="danger" className="ms-2" onClick={act}>
        <icon-trash>Borrar</icon-trash>
      </Button>
    </>
  );
};
