import { h, FunctionComponent } from 'preact';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from 'react-bootstrap';

import styles from './styles.module.css';

const ConfirmDelete: FunctionComponent<{
  descr?: string;
  onClose: (result: boolean) => void;
}> = ({ descr, onClose }) => (
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
