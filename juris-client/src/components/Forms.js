import juris from '@src/jurisInstance.js';
import '@components/Loading.js';

const validFieldNames = [
  'TextField',
  'CheckboxField',
  'SelectField',
  'SubmitButton',
];

let rootCounter = 0;

juris.registerComponent(
  'Form',
  (
    { name, children, onsubmit, onchange, ...extra },
    { getState, setState, subscribe, executeBatch, LoadingMgr }
  ) => {
    const stateRoot = `##form${name}-${rootCounter++}`;
    setState(stateRoot, {});

    const propagateRoot = (children) =>
      children.map((child) => {
        if (typeof child !== 'object') return child;
        const [tag, attrs] = Object.entries(child)[0];
        if (validFieldNames.includes(Object.keys(child)[0]))
          return { [tag]: { ...attrs, stateRoot } };
        if ('children' in attrs) return propagateRoot(attrs.children);
        return child;
      });

    const getValues = () =>
      Object.entries(getState(stateRoot)).reduce(
        (values, [name, state]) => ({ ...values, [name]: state.value }),
        {}
      );

    let inOnChange = false;

    const unsubscribe =
      onchange &&
      subscribe(stateRoot, (value, oldValue, path) => {
        if (inOnChange) return;
        const changes = onchange(getValues(), path, value);
        if (changes) {
          inOnChange = true;
          executeBatch(() =>
            Object.entries(changes).forEach(([name, value]) => {
              setState(`${stateRoot}.${name}.value`, value);
            })
          );
          inOnChange = false;
        }
      });
    return {
      render: () => ({
        form: {
          novalidate: true,
          ...extra,
          onsubmit: (ev) => {
            ev.preventDefault();
            ev.target.checkValidity();
            if (
              Object.values(getState(stateRoot)).some((state) => !!state.error)
            ) {
              return;
            }
            const loadingMsg = `Enviando formulario ${name}`;
            LoadingMgr.open(loadingMsg);
            onsubmit(getValues(), ev);
            LoadingMgr.close(loadingMsg);
          },
          children: propagateRoot(children),
        },
      }),
      hooks: {
        onUnmount: () => {
          if (unsubscribe) unsubscribe();
          setState(stateRoot, null);
        },
      },
    };
  }
);

export const baseFieldFrame = (children) => ({
  div: {
    className: 'form-floating mb-3',
    children,
  },
});

export const checkFieldFrame = (children) => ({
  div: {
    className: 'form-check mb-3',
    children,
  },
});

export const fieldLabel = (name, label) => ({
  label: {
    for: `${name}Field`,
    text: label,
  },
});

export const checkLabel = (name, label) => ({
  label: {
    for: `${name}Field`,
    className: 'form-check-label',
    text: label,
  },
});

export const errorFeedback = (errorMessage) =>
  errorMessage
    ? {
        div: {
          className: 'invalid-feedback',
          text: errorMessage,
        },
      }
    : null;

export const requiredHelp = (isRequired) =>
  isRequired
    ? { div: { class: 'form-text', text: '* Campo obligatorio' } }
    : null;

export const extraHelp = (instructions) =>
  instructions ? { div: { class: 'form-text', text: instructions } } : null;

juris.registerComponent(
  'TextField',
  (
    { name, label, value, stateRoot, type, errorText, ...extra },
    { getState, setState }
  ) => {
    const statePath = `${stateRoot}.${name}`;

    setState(statePath, {
      value,
      error: null,
      required: !!extra.required,
    });

    return baseFieldFrame([
      {
        input: {
          name,
          type: type ?? 'text',
          className: () =>
            `form-control${getState(statePath).error ? ' is-invalid' : ''}`,
          id: `${name}Field`,
          value: () => getState(statePath).value,
          oninput: (ev) => {
            setState(statePath, {
              error: null,
              value: ev.target.value,
              required: !!extra.required,
            });
          },
          oninvalid: (ev) => {
            setState(`${statePath}.error`, ev.target.validationMessage);
          },
          ...extra,
        },
      },
      fieldLabel(name, label),
      errorFeedback(getState(statePath).error),
      requiredHelp(extra.required),
      extraHelp(extra.instructions),
    ]);
  }
);

juris.registerComponent(
  'CheckboxField',
  ({ name, label, value, stateRoot, ...extra }, { getState, setState }) => {
    const statePath = `${stateRoot}.${name}`;
    setState(statePath, {
      value,
      error: null,
    });

    return checkFieldFrame([
      extra.readonly
        ? {
            i: {
              style: { 'margin-top': 0 },
              className: `bi form-check-input ${
                getState(statePath).value ? 'bi-check-square' : 'bi-square'
              }`,
            },
          }
        : {
            input: {
              name,
              className: 'form-check-input',
              type: 'checkbox',
              id: `${name}Field`,
              checked: () => !!getState(statePath).value,
              onclick: (ev) => {
                setState(statePath, {
                  value: ev.target.checked,
                  error: null,
                });
              },
              ...extra,
            },
          },
      checkLabel(name, label),
      errorFeedback(getState(statePath).error),
      extraHelp(extra.instructions),
    ]);
  }
);

juris.registerComponent(
  'SelectField',
  (
    {
      name,
      label,
      value,
      stateRoot,
      options,
      valueFieldName,
      labelFieldName,
      errorText,
      ...extra
    },
    { getState, setState }
  ) => {
    const statePath = `${stateRoot}.${name}`;

    setState(statePath, {
      value,
      error: null,
      required: !!extra.required,
    });

    return baseFieldFrame([
      {
        select: {
          name,
          className: () =>
            `form-control${getState(statePath).error ? ' is-invalid' : ''}`,
          id: `${name}Field`,
          children: options.map((row) => ({
            option: {
              value: row[valueFieldName],
              text: row[labelFieldName],
            },
          })),
          value: () => getState(statePath).value,
          onchange: (ev) => {
            setState(statePath, {
              error: null,
              value: ev.target.value,
              required: !!extra.required,
            });
          },
          oninvalid: (ev) => {
            setState(`${statePath}.error`, ev.target.validationMessage);
          },
          ...extra,
        },
      },
      fieldLabel(name, label),
      errorFeedback(getState(statePath).error),
      requiredHelp(extra.required),
      extraHelp(extra.instructions),
    ]);
  }
);

juris.registerComponent(
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
            Object.values(getState(stateRoot)).some(
              (state) => !!state.error || (state.required && !state.value)
            ),
        },
      }),
    };
  }
);
