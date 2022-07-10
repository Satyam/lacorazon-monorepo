import { Button, ButtonGroup } from 'react-bootstrap';
import {
  IconAdd,
  IconEdit,
  IconShow,
  IconTrash,
} from '@lacorazon/lit-react-integration';
type RowActions = 'show' | 'edit' | 'delete';
export type TableRowActionHandler = (
  action: RowActions,
  id: ID,
  descr: string
) => void;

export const TableRowButtons = ({
  onClick,
  id,
  descr,
}: {
  onClick: TableRowActionHandler;
  id: ID;
  descr: string;
}) => {
  const act = (action: RowActions) => (ev: { preventDefault: () => void }) => {
    ev.preventDefault();
    onClick(action, id, descr);
  };
  return (
    <ButtonGroup size="sm">
      <Button variant="outline-info" title="Ver detalle" onClick={act('show')}>
        <IconShow />
      </Button>
      <Button
        variant="outline-secondary"
        title="Modificar"
        onClick={act('edit')}
      >
        <IconEdit />
      </Button>
      <Button variant="outline-danger" title="Borrar" onClick={act('delete')}>
        <IconTrash />
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
      <IconAdd>Agregar</IconAdd>
    </Button>
  ) : (
    <>
      <Button variant="primary" type="submit">
        <IconEdit>Modificar</IconEdit>
      </Button>
      <Button variant="danger" className="ms-2" onClick={act}>
        <IconTrash>Borrar</IconTrash>
      </Button>
    </>
  );
};
