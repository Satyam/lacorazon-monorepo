// The first one from Preact template
declare module '*.css' {
  const mapping: Record<string, string>;
  export default mapping;
}

declare module '*.module.css';
declare module '*.jpg';
declare module '*.gif';
declare module '*.png';

type BootstrapColor =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'warning'
  | 'danger'
  | 'info'
  | 'dark'
  | 'light';
type BootstrapSize = 'sm' | 'md' | 'lg';
