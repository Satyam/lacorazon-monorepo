import juris from '@src/jurisInstance.js';

import '@headless/Navigation.js';
import '@headless/User.js';

import { textField } from '@src/utils.js';

juris.registerComponent(
  'Login',
  (props, { setState, getState, newState, User, Navigation }) => {
    const [getEmail, setEmail] = newState('email', 'pepe@correo.com');
    const [getPassword, setPassword] = newState('password', 'pepecito');
    const [getSubmitting, setSubmitting] = newState('submitting', false);
    const [get401, set401] = newState('unauthorized', false);
    return {
      render: () => {
        setState('title', 'Login');
        return {
          form: {
            novalidate: true,
            onsubmit: (ev) => {
              ev.preventDefault();
              setSubmitting(true);
              User.login(getEmail(), getPassword())
                .then(() => {
                  setSubmitting(false);
                  Navigation.back();
                })
                .catch(({ error, data }) => {
                  setSubmitting(false);
                  if (error === 401) {
                    set401(true);
                    console.info('unauthorized');
                    // setState('user.unauthorized', true);
                  } else {
                    console.error('other error', error, data);
                    throw new Error(
                      `Unexpected error in DataFetch [${error}] ${data}`
                    );
                  }
                });
            },
            children: [
              () =>
                get401()
                  ? {
                      div: {
                        className: 'alert alert-warning',
                        text: 'Usuario inexistente o contraseña inválida',
                      },
                    }
                  : null,
              textField('email', 'Email', () => getEmail(), {
                required: true,
                invalid: get401(),
                oninput: (ev) => setEmail(ev.target.value),
                errorText: 'Debe indicar la dirección de correo registrada',
                placeholder: 'Email',
              }),
              textField('password', 'Contraseña', () => getPassword(), {
                type: 'password',
                placeholder: 'Contraseña',
                required: true,
                oninput: (ev) => setPassword(ev.target.value),
                invalid: get401(),
                errorText: 'Debe indicar una contraseña',
              }),
              {
                button: {
                  type: 'submit',
                  className: 'btn btn-primary',
                  disabled: () =>
                    !(getEmail() || getPassword()) || getSubmitting(),
                  text: 'Acceder',
                },
              }, // button
            ],
          },
        }; // form
      },
    };
  }
);
