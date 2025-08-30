juris.registerComponent(
  'Login',
  (props, { setState, getState, newState, User, Navigation }) => {
    const [getEmail, setEmail] = newState('email', '');
    const [getPassword, setPassword] = newState('password', '');
    return {
      render: () => {
        setState('title', 'Login');
        return {
          form: {
            novalidate: true,
            onsubmit: (ev) => {
              ev.preventDefault();
              User.login(getEmail(), getPassword()).then(() =>
                Navigation.back()
              );
            },
            children: [
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
                              className: 'form-control',
                              placeholder: 'Email',
                              required: true,
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
                              className: 'form-control',
                              placeholder: 'Contraseña',
                              required: true,
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
                  disabled: () => !(getEmail() || getPassword()),
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
