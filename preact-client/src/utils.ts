export const getTarget = <T extends HTMLElement>(ev: MouseEvent) =>
  ev.target as T;
