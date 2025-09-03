const currency = 'EUR';
const locale = 'es-ES';

const dateFormatter = new Intl.DateTimeFormat(locale, {
  dateStyle: 'medium',
});

export const formatDate = (date) =>
  date instanceof Date
    ? dateFormatter.format(date)
    : date
    ? dateFormatter.format(new Date(date))
    : '';

const currFormatter = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency,
});

export const formatCurrency = (value) =>
  typeof value === 'undefined' ? '' : currFormatter.format(value);

export const iconCheck = (value) => ({
  i: {
    className: `bi ${value ? 'bi-check-square' : 'bi-square'}`,
  },
});
