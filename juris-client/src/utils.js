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

export const datePart = (date) => {
  const iso = date.toISOString();
  return iso.substring(0, iso.indexOf('T'));
};

const currFormatter = new Intl.NumberFormat(locale, {
  style: 'currency',
  currency,
});

export const formatCurrency = (value) =>
  typeof value === 'undefined' ? '' : currFormatter.format(value);

export const iconCheck = (value, text) => ({
  i: {
    className: `bi ${value ? 'bi-check-square' : 'bi-square'}`,
    text,
  },
});

export const h = (tag, attrs, ...children) => ({
  [typeof tag === 'function' ? tag.name : tag]: {
    ...attrs,
    children,
  },
});
