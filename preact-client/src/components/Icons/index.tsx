import { h, FunctionComponent } from 'preact';
import { Button, ButtonProps } from 'react-bootstrap';
import classNames from 'classnames/bind';
import {
  FaPlusCircle,
  FaRegTrashAlt,
  FaRegEdit,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaCalendarAlt,
  FaExclamationCircle,
  FaExclamationTriangle,
} from 'react-icons/fa';

import styles from './styles.module.css';

export type MyButtonProps = {
  color?: BootstrapColor;
} & Omit<ButtonProps, 'color'>;
const cx = classNames.bind(styles);

export const Icon: FunctionComponent<{
  Component: typeof FaEye;
  color?: BootstrapColor;
  isButton?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (ev: MouseEvent) => void;
}> = ({
  Component,
  color,
  isButton,
  disabled,
  className,
  onClick,
  ...props
}) => (
  <Component
    className={cx(className, {
      'active-icon': isButton && !disabled,
      [`icon-${color}`]: color,
      disabled,
    })}
    // @ts-ignore
    onClick={disabled ? undefined : onClick}
    {...props}
  />
);

export const IconAdd: FunctionComponent<{ color?: BootstrapColor }> = ({
  color = 'primary',
  ...props
}) => <Icon color={color} Component={FaPlusCircle} {...props} />;

export const ButtonIconAdd: FunctionComponent<MyButtonProps> = ({
  children,
  color = 'primary',
  title = 'Agregar',
  ...props
}) => (
  <Button color={color} title={title} {...props}>
    <FaPlusCircle />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconDelete: FunctionComponent<{ color?: BootstrapColor }> = ({
  color = 'danger',
  ...props
}) => <Icon color={color} Component={FaRegTrashAlt} {...props} />;

export const ButtonIconDelete: FunctionComponent<MyButtonProps> = ({
  children,
  color = 'danger',
  title = 'Borrar',
  ...props
}) => (
  <Button color={color} title={title} {...props}>
    <FaRegTrashAlt />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconEdit: FunctionComponent<{ color?: BootstrapColor }> = ({
  color = 'secondary',
  ...props
}) => <Icon color={color} Component={FaRegEdit} {...props} />;

export const ButtonIconEdit: FunctionComponent<MyButtonProps> = ({
  children,
  color = 'secondary',
  title = 'Modificar',
  ...props
}) => (
  <Button color={color} title={title} {...props}>
    <FaRegEdit />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconView: FunctionComponent<{ color?: BootstrapColor }> = ({
  color = 'info',
  ...props
}) => <Icon color={color} Component={FaEye} {...props} />;

export const ButtonIconView: FunctionComponent<MyButtonProps> = ({
  children,
  color = 'info',
  title = 'Ver detalle',
  ...props
}) => (
  <Button color={color} title={title} {...props}>
    <FaEye />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconCheck: FunctionComponent<{ color?: BootstrapColor }> = ({
  color = 'success',
  ...props
}) => <Icon color={color} Component={FaCheckCircle} {...props} />;

export const ButtonIconCheck: FunctionComponent<MyButtonProps> = ({
  children,
  color = 'success',
  ...props
}) => (
  <Button color={color} {...props}>
    <FaCheckCircle />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconNotCheck: FunctionComponent<{ color?: BootstrapColor }> = ({
  color = 'danger',
  ...props
}) => <Icon color={color} Component={FaTimesCircle} {...props} />;

export const ButtonIconNotCheck: FunctionComponent<MyButtonProps> = ({
  children,
  color = 'warning',
  ...props
}) => (
  <Button color={color} {...props}>
    <FaTimesCircle />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconCalendar: FunctionComponent<{ color?: BootstrapColor }> = ({
  color = 'secondary',
  ...props
}) => <Icon color={color} Component={FaCalendarAlt} {...props} />;

export const ButtonIconCalendar: FunctionComponent<MyButtonProps> = ({
  children,
  color = 'secondary',
  title = 'Calendario',
  ...props
}) => (
  <Button color={color} title={title} {...props}>
    <FaCalendarAlt />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconWarning: FunctionComponent<{ color?: BootstrapColor }> = ({
  color = 'warning',
  ...props
}) => <Icon color={color} Component={FaExclamationTriangle} {...props} />;

export const IconStop: FunctionComponent<{ color?: BootstrapColor }> = ({
  color = 'danger',
  ...props
}) => <Icon color={color} Component={FaExclamationCircle} {...props} />;

export const ButtonSet: FunctionComponent<{
  className?: string;
  size?: BootstrapSize;
}> = ({ className, children, size, ...rest }) => (
  <div
    className={cx('buttonSet', { [`btn-group-${size}`]: size }, className)}
    {...rest}
  >
    {children}
  </div>
);
