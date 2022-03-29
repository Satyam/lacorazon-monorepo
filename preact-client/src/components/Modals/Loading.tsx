import { h, FunctionComponent } from 'preact';
// import icon from './loading.gif';
import { Modal, ModalHeader, ModalBody } from 'react-bootstrap';
import styles from './styles.module.css';

const Loading: FunctionComponent<{
  title?: string;
  noIcon?: boolean;
  isOpen?: boolean;
}> = ({
  title = 'Cargando ....',
  children,
  noIcon,
  isOpen = true,
  ...props
}) => (
  <Modal show={isOpen} {...props}>
    <ModalHeader className={styles.loadingHeader}>{title}</ModalHeader>
    <ModalBody className={styles.loadingContainer}>
      {children}
      {!noIcon && (
        <img className={styles.loadingImg} src="loading.gif" alt="loading..." />
      )}
    </ModalBody>
  </Modal>
);

export default Loading;
