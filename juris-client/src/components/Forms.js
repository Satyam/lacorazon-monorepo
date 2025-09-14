import juris from '@src/jurisInstance.js';
import '@components/Loading.js';
import { iconCheck } from '../utils.js';

export const Form = juris.registerComponent(
  'Form',
  ({ name, children, onsubmit }, { getState, setState, LoadingMgr }) => {
    const stateRoot = `##form${name}`;
    setState(stateRoot, {});
    return {
      render: () => ({
        form: {
          novalidate: true,
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
            onsubmit(
              Object.entries(getState(stateRoot)).reduce(
                (values, [name, state]) => ({ ...values, [name]: state.value }),
                {}
              ),
              ev
            );
            LoadingMgr.close(loadingMsg);
          },
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
    const statePath = `${stateRoot}.${name}`;

    setState(statePath, {
      value,
      error: null,
      required: !!extra.required,
    });

    return baseFieldFrame(name, label, [
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
      () =>
        getState(statePath).error
          ? {
              div: {
                className: 'invalid-feedback',
                text: getState(statePath).error,
              },
            }
          : null,
      () =>
        extra.required
          ? { div: { class: 'form-text', text: '* Campo obligatorio' } }
          : null,
      () =>
        extra.instructions
          ? { div: { class: 'form-text', text: extra.instructions } }
          : null,
    ]);
  }
);

export const CheckboxField = juris.registerComponent(
  'CheckboxField',
  ({ name, label, value, stateRoot, ...extra }, { getState, setState }) => {
    const statePath = `${stateRoot}.${name}`;
    setState(statePath, {
      value,
      error: null,
    });

    return baseFieldFrame(name, '', {
      div: {
        className: 'form-check',
        children: extra.readonly
          ? iconCheck(getState(statePath).value, label)
          : [
              {
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
              {
                label: {
                  className: 'form-check-label',
                  for: `${name}Field`,
                  text: label,
                },
              },
              () =>
                getState(statePath).error
                  ? {
                      div: {
                        className: 'invalid-feedback',
                        text: getState(statePath).error,
                      },
                    }
                  : null,
              () =>
                getState(statePath).error
                  ? {
                      div: {
                        className: 'invalid-feedback',
                        text: getState(statePath).error,
                      },
                    }
                  : null,
              () =>
                extra.required
                  ? {
                      div: {
                        class: 'form-text',
                        text: '* Campo obligatorio',
                      },
                    }
                  : null,
              () =>
                extra.instructions
                  ? { div: { class: 'form-text', text: extra.instructions } }
                  : null,
            ],
      },
    });
  }
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
            Object.values(getState(stateRoot)).some(
              (state) => !!state.error || (state.required && !state.value)
            ),
        },
      }),
    };
  }
);
