import { h, ComponentChildren } from 'preact';
import { Modal, ModalHeader, ModalBody } from 'react-bootstrap';
import styles from './styles.module.css';

const Loading = ({
  title = 'Cargando ....',
  children,
  noIcon,
  isOpen = true,
  ...props
}: {
  title?: string;
  noIcon?: boolean;
  isOpen?: boolean;
  children: ComponentChildren;
}) => (
  <Modal show={isOpen} {...props}>
    <ModalHeader className={styles.loadingHeader}>{title}</ModalHeader>
    <ModalBody className={styles.loadingContainer}>
      {children}
      {!noIcon && (
        <img
          className={styles.loadingImg}
          src="/loading.gif"
          alt="loading..."
        />
      )}
    </ModalBody>
  </Modal>
);

export default Loading;
