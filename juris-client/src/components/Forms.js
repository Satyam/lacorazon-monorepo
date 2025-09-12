import juris from '@src/jurisInstance.js';

export const Form = juris.registerComponent(
  'Form',
  ({ name, children, onsubmit }, { getState, setState }) => {
    const stateRoot = `##form${name}`;
    setState(stateRoot, {
      values: {},
      errors: {},
    });
    return {
      render: () => ({
        form: {
          novalidate: true,
          onsubmit: (ev) => {
            ev.preventDefault();
            ev.target.checkValidity();
            if (
              Object.values(getState(`${stateRoot}.errors`)).some(
                (err) => !!err
              )
            ) {
              return;
            }
            return onsubmit(ev);

            /*: (ev) => {
            ev.preventDefault();
            setSubmitting(true);
          }*/
          },
          // [ {div: {a:1,b:2}}].map(child => {const [tag, attrs] = Object.entries(child)[0]; return {[tag]: {...attrs, c:3}}})
          children: children.map((child) => {
            const [tag, attrs] = Object.entries(child)[0];
            return { [tag]: { ...attrs, stateRoot } };
          }),
        },
      }),
      hooks: {
        onUnmount: () => {
          setState(stateRoot, null);
        },
      },
    };
  }
);

const baseFieldFrame = (name, label, input) => ({
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

export const TextField = juris.registerComponent(
  'TextField',
  (
    { name, label, value, stateRoot, type, errorText, ...extra },
    { getState, setState }
  ) => {
    const valueStatePath = `${stateRoot}.values.${name}`;
    const errorStatePath = `${stateRoot}.errors.${name}`;

    setState(valueStatePath, value);
    setState(errorStatePath, null);

    return baseFieldFrame(name, label, [
      {
        input: {
          name,
          type: type ?? 'text',
          className: () =>
            `form-control${getState(errorStatePath) ? ' is-invalid' : ''}`,
          id: `${name}Field`,
          value: () => getState(valueStatePath),
          oninput: (ev) => setState(valueStatePath, ev.target.value),
          oninvalid: (ev) => {
            setState(errorStatePath, ev.target.validationMessage);
          },
          ...extra,
        },
      },
      () =>
        getState(errorStatePath)
          ? {
              div: {
                className: 'invalid-feedback',
                text: getState(errorStatePath),
              },
            }
          : null,
    ]);
  }
);

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

export const SubmitButton = juris.registerComponent(
  'SubmitButton',
  ({ name, label, stateRoot, ...extra }, { getState, setState }) => {
    return {
      render: () => ({
        button: {
          name,
          type: extra.type ?? 'submit',
          text: label,
          class: 'btn btn-primary',
          disabled: () =>
            Object.values(getState(`${stateRoot}.errors`)).some(
              (err) => !!err
            ) ||
            Object.values(getState(`${stateRoot}.values`)).some(
              (value) => !value
            ),
        },
      }),
    };
  }
);
