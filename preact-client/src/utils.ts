export const getTarget = <T extends HTMLElement>(ev: MouseEvent) =>
  ev.target as T;

export const getRowDataset = <T extends Record<string, unknown>>(ev: Event) =>
  (ev.currentTarget as HTMLElement).closest('tr')?.dataset as T;
