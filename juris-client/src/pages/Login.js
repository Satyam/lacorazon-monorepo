import juris from '@src/jurisInstance.js';

import '@headless/Navigation.js';
import '@headless/User.js';

import '@components/Forms.js';
juris.registerComponent(
  'Login',
  ({ unauthorized }, { setState, getState, newState, User, Navigation }) => {
    const [get401, set401] = newState('unauthorized', false);
    return {
      render: () => {
        setState('title', 'Login');
        return {
          Form: {
            name: 'login',
            onsubmit: ({ email, password }) => {
              User.login(email, password)
                .then(() => {
                  Navigation.back();
                })
                .catch(({ error, data }) => {
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
                unauthorized
                  ? {
                      div: {
                        className: 'alert alert-warning',
                        text: 'Su sesión ha caducado, ingrese nuevamente',
                      },
                    }
                  : null,
              () =>
                get401()
                  ? {
                      div: {
                        className: 'alert alert-warning',
                        text: 'Usuario inexistente o contraseña inválida',
                      },
                    }
                  : null,
              {
                TextField: {
                  name: 'email',
                  label: 'Email',
                  value: 'pepe@correo.com',
                  required: true,
                  invalid: () => get401(),
                  errorText: 'Debe indicar la dirección de correo registrada',
                  placeholder: 'Email',
                },
              },
              {
                TextField: {
                  name: 'password',
                  label: 'Contraseña',
                  type: 'password',
                  value: 'pepecito',
                  placeholder: 'Contraseña',
                  required: true,
                  invalid: () => get401(),
                  errorText: 'Debe indicar una contraseña',
                },
              },
              {
                SubmitButton: {
                  label: 'Acceder',
                },
              },
            ],
          },
        };
      },
    };
  }
);
