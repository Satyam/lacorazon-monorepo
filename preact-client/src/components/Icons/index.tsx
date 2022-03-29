import { h, ComponentChildren } from 'preact';
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

export type IconProps = {
  color?: BootstrapColor;
};
export const Icon = ({
  Component,
  color,
  isButton,
  disabled,
  className,
  onClick,
  ...props
}: {
  Component: typeof FaEye;
  color?: BootstrapColor;
  isButton?: boolean;
  disabled?: boolean;
  className?: string;
  onClick?: (ev: MouseEvent) => void;
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

export const IconAdd = ({ color = 'primary', ...props }: IconProps) => (
  <Icon color={color} Component={FaPlusCircle} {...props} />
);

export const ButtonIconAdd = ({
  children,
  color = 'primary',
  title = 'Agregar',
  ...props
}: MyButtonProps) => (
  <Button color={color} title={title} {...props}>
    <FaPlusCircle />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconDelete = ({ color = 'danger', ...props }: IconProps) => (
  <Icon color={color} Component={FaRegTrashAlt} {...props} />
);

export const ButtonIconDelete = ({
  children,
  color = 'danger',
  title = 'Borrar',
  ...props
}: MyButtonProps) => (
  <Button color={color} title={title} {...props}>
    <FaRegTrashAlt />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconEdit = ({ color = 'secondary', ...props }: IconProps) => (
  <Icon color={color} Component={FaRegEdit} {...props} />
);

export const ButtonIconEdit = ({
  children,
  color = 'secondary',
  title = 'Modificar',
  ...props
}: MyButtonProps) => (
  <Button color={color} title={title} {...props}>
    <FaRegEdit />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconView = ({ color = 'info', ...props }: IconProps) => (
  <Icon color={color} Component={FaEye} {...props} />
);

export const ButtonIconView = ({
  children,
  color = 'info',
  title = 'Ver detalle',
  ...props
}: MyButtonProps) => (
  <Button color={color} title={title} {...props}>
    <FaEye />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconCheck = ({ color = 'success', ...props }: IconProps) => (
  <Icon color={color} Component={FaCheckCircle} {...props} />
);

export const ButtonIconCheck = ({
  children,
  color = 'success',
  ...props
}: MyButtonProps) => (
  <Button color={color} {...props}>
    <FaCheckCircle />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconNotCheck = ({ color = 'danger', ...props }: IconProps) => (
  <Icon color={color} Component={FaTimesCircle} {...props} />
);

export const ButtonIconNotCheck = ({
  children,
  color = 'warning',
  ...props
}: MyButtonProps) => (
  <Button color={color} {...props}>
    <FaTimesCircle />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconCalendar = ({ color = 'secondary', ...props }: IconProps) => (
  <Icon color={color} Component={FaCalendarAlt} {...props} />
);

export const ButtonIconCalendar = ({
  children,
  color = 'secondary',
  title = 'Calendario',
  ...props
}: MyButtonProps) => (
  <Button color={color} title={title} {...props}>
    <FaCalendarAlt />
    <span className={styles.label}>{children}</span>
  </Button>
);

export const IconWarning = ({ color = 'warning', ...props }: IconProps) => (
  <Icon color={color} Component={FaExclamationTriangle} {...props} />
);

export const IconStop = ({ color = 'danger', ...props }: IconProps) => (
  <Icon color={color} Component={FaExclamationCircle} {...props} />
);

export const ButtonSet = ({
  className,
  children,
  size,
  ...rest
}: {
  className?: string;
  size?: BootstrapSize;
  children: ComponentChildren;
}) => (
  <div
    className={cx('buttonSet', { [`btn-group-${size}`]: size }, className)}
    {...rest}
  >
    {children}
  </div>
);
