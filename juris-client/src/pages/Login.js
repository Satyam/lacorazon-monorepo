import juris from '@src/juris.js';

import '@headless/Navigation.js';
import '@headless/User.js';

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
              {
                label: {
                  className: 'form-group row',
                  children: [
                    {
                      div: {
                        className: 'col-sm-2 col-form-label',
                        text: 'Email',
                      },
                    }, // div
                    {
                      div: {
                        className: 'col-sm-10',
                        children: [
                          {
                            input: {
                              name: 'email',
                              className: () =>
                                `form-control${get401() ? ' is-invalid' : ''}`,
                              placeholder: 'Email',
                              required: true,
                              value: 'pepe@correo.com',
                              oninput: (ev) => setEmail(ev.target.value),
                            },
                          },
                          {
                            div: {
                              className: 'invalid-feedback',
                              text: 'Debe indicar la dirección de correo registrada',
                            },
                          }, // div
                        ],
                      },
                    }, // div
                  ],
                },
              }, // label
              {
                label: {
                  className: 'form-group row',
                  children: [
                    {
                      div: {
                        className: 'col-sm-2 col-form-label',
                        text: 'Contraseña',
                      },
                    }, // div
                    {
                      div: {
                        className: 'col-sm-10',
                        children: [
                          {
                            input: {
                              type: 'password',
                              name: 'password',
                              className: () =>
                                `form-control${get401() ? ' is-invalid' : ''}`,
                              placeholder: 'Contraseña',
                              required: true,
                              value: 'pepecito',
                              oninput: (ev) => setPassword(ev.target.value),
                            },
                          }, // input
                          {
                            div: {
                              className: 'invalid-feedback',
                              text: 'Debe indicar una contraseña',
                            },
                          }, // div
                        ],
                      },
                    }, // div
                  ],
                },
              }, // label
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
