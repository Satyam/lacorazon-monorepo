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

export const baseFieldFrame = (name, label, input) => ({
  div: {
    className: 'mb-3 row',
    children: [
      {
        label: {
          for: `${name}Field`,
          className: 'col-sm-2 col-form-label',
          text: label,
        },
      },
      {
        div: {
          className: 'col-sm-10',
          children: input,
        },
      },
    ],
  },
});

export const textField = (
  name,
  label,
  value,
  { type, invalid, errorText, ...extra } = {}
) =>
  baseFieldFrame(name, label, [
    {
      input: {
        name,
        type: type ?? 'text',
        className: () => `form-control${invalid ? ' is-invalid' : ''}`,
        id: `${name}Field`,
        value,
        ...extra,
      },
    },
    () =>
      errorText
        ? {
            div: {
              className: 'invalid-feedback',
              text: errorText,
            },
          }
        : null,
  ]);

export const checkboxField = (name, label, value, extra = {}) =>
  baseFieldFrame(
    name,
    '',
    extra.readonly
      ? iconCheck(value, label)
      : [
          {
            input: {
              name,
              className: 'form-check-input',
              type: 'checkbox',
              id: `${name}Field`,
              checked: value,
              ...extra,
            },
          },
          {
            label: {
              className: 'form-check-label',
              for: `${name}Field`,
              text: label,
            },
          },
        ]
  );
