export const getTarget = <T extends HTMLElement>(ev: MouseEvent) =>
  ev.target as T;

export const getRowDataset = <T extends Record<string, unknown>>(ev: Event) =>
  (ev.currentTarget as HTMLElement).closest('tr')?.dataset as T;

const currency = 'EUR';
const locale = 'es-ES';

const dateFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: 'medium',
});

export const formatDate = (date: Date | string) =>
  date instanceof Date
    ? dateFormatter.format(date)
    : date
    ? dateFormatter.format(new Date(date))
    : '';

const currFormatter = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency,
});

export const formatCurrency = (value?: number) =>
  typeof value === 'undefined' ? '' : currFormatter.format(value);
