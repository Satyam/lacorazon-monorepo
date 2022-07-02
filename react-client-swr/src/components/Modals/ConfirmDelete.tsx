import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'react-bootstrap';

import styles from './styles.module.css';

const ConfirmDelete = ({
  descr,
  onClose,
}: {
  descr?: string;
  onClose: (result: boolean) => void;
}) => (
  <Modal show={!!descr}>
    <ModalHeader className={styles.confirmDeleteHeader}>
      Confirmación borrado
    </ModalHeader>
    <ModalBody className={styles.confirmDeleteBody}>
      {`¿Está seguro que desea borrar ${descr} ?`}
    </ModalBody>
    <ModalFooter>
      <Button
        variant="outline-danger"
        onClick={() => {
          onClose(true);
        }}
      >
        Sí
      </Button>
      <Button variant="outline-secondary" onClick={() => onClose(false)}>
        No
      </Button>
    </ModalFooter>
  </Modal>
);

export default ConfirmDelete;
