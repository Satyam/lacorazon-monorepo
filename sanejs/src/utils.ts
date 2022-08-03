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

export const allSections = ['main', 'heading', 'title'];

export const datePart = (ds: Date | string = new Date()) => {
  const d = ds instanceof Date ? ds : new Date(ds);
  return [
    d.getFullYear().toString().padStart(4, '0'),
    (d.getMonth() + 1).toString().padStart(2, '0'),
    d.getDate().toString().padStart(2, '0'),
  ].join('-');
};
