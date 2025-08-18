// TODO: use Conditional

juris.registerComponent('NavItem', ({ href, text, hidden = false }, {}) => {
  return {
    li: {
      style: {
        display: hidden ? 'none' : 'block',
      },
      className: 'nav-item',
      children: [
        {
          a: {
            className: 'nav-link',
            href,
            text,
          },
        }, // a.
      ],
    },
  };
});

juris.registerComponent(
  'NavBar',
  (props, { getState, setState, Navigation, newState }) => {
    const [getShow, setShow] = newState('show', false);
    return {
      div: {
        children: [
          {
            nav: {
              id: 'navbar',
              className: 'navbar navbar-light navbar-expand-lg',
              children: [
                {
                  a: {
                    className: 'navbar-brand',
                    href: '#',
                    children: [
                      { img: { src: '/La Corazon.png', alt: 'La Corazón' } },
                      ' La Corazón',
                    ],
                    onclick: (ev) => {
                      ev.preventDefault();
                      Navigation.push('/');
                    },
                  },
                },
                {
                  button: {
                    className: 'navbar-toggler',
                    type: 'button',
                    children: [
                      { span: { className: 'navbar-toggler-icon' } }, // span.
                    ],
                    onclick: (ev) => {
                      ev.preventDefault();
                      setShow(!getShow());
                      $collapse.classList.toggle('show');
                    },
                  },
                }, // button.
                {
                  div: {
                    className: () =>
                      `collapse navbar-collapse ${getShow() ? 'show' : ''}`,
                    children: [
                      {
                        ul: {
                          className: 'navbar-nav me-auto logged-in',
                          children: [
                            {
                              NavItem: { href: '/usuarios', text: 'Usuarios' },
                            },
                            {
                              NavItem: {
                                href: '/vendedores',
                                text: 'Vendedores',
                              },
                            },
                            {
                              NavItem: {
                                href: '/distribuidores',
                                text: 'Distribuidores',
                              },
                            },
                            {
                              NavItem: {
                                href: '/ventas',
                                text: 'Ventas',
                              },
                            },
                          ],
                        },
                      }, // ul.
                      {
                        span: {
                          className: 'navbar-text ms-auto',
                          children: [
                            {
                              i: {
                                className: 'bi bi-person-x logged-out',
                                children: [' Invitado'],
                              },
                            }, // i.
                            {
                              i: {
                                className: 'bi bi-person-check-fill logged-in',
                                children: [
                                  { span: { className: 'user-name' } },
                                ],
                              },
                            }, // i.
                          ],
                        },
                      }, // span.
                      {
                        ul: {
                          className: 'navbar-nav',
                          children: [
                            {
                              NavItem: {
                                href: '/login',
                                text: 'Login',
                                hidden: () => !getState('user.name'),
                              },
                            },
                            {
                              NavItem: {
                                href: '/logout',
                                text: 'Logout',
                                hidden: () => getState('user.name'),
                              },
                            },
                          ],
                        },
                      }, // ul.
                    ],
                  },
                }, // div.
              ],
            },
          },
          {
            h1: {
              text: getState('title'),
            },
          },
        ],
      },
    }; // nav.
  }
);

// <(\w+)\s           {$1:{
// <\/(\w+)\s?}       } // $1.
// (\w+)="([^"]*)"    $1: '$2',
// className:         className:
// />
