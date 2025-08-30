juris.registerComponent(
  'NavItem',
  ({ href, text }, { getState, Navigation }) => ({
    render: () => ({
      li: {
        className: 'nav-item',
        children:
          getState('url.path') === href
            ? {
                div: {
                  className: 'nav-link active',
                  text,
                },
              } // a.
            : {
                a: {
                  className: 'nav-link',
                  href,
                  text,
                  onclick: (ev) => {
                    ev.preventDefault();
                    Navigation.push(href);
                  },
                },
              }, // a.
      },
    }),
  })
);

juris.registerComponent(
  'NavBar',
  (props, { getState, setState, Navigation, newState, User }) => ({
    render: () => {
      const [getCollapsed, setCollapsed] = newState('collapsed', false);
      const [getShowDropdown, setShowDropdown] = newState(
        'showDropdown',
        false
      );
      const currentPath = getState('url.path');
      return {
        div: {
          children: [
            {
              nav: {
                className: 'navbar navbar-expand-lg',
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
                      className: () =>
                        `navbar-toggler ${getCollapsed() ? ' collapsed' : ''}`,
                      type: 'button',
                      children: [
                        { span: { className: 'navbar-toggler-icon' } }, // span.
                      ],
                      onclick: (ev) => {
                        ev.preventDefault();
                        setCollapsed(!getCollapsed());
                      },
                    },
                  }, // button.
                  {
                    div: {
                      className: () =>
                        `collapse navbar-collapse ${
                          getCollapsed() ? 'show' : ''
                        }`,
                      children: [
                        {
                          ul: {
                            className: 'navbar-nav',
                            children: () =>
                              getState('user.name')
                                ? [
                                    {
                                      NavItem: {
                                        href: '/usuarios',
                                        text: 'Usuarios',
                                      },
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
                                  ]
                                : null,
                          },
                        }, // ul.
                        {
                          div: {
                            className: 'navbar-text ms-auto dropdown',
                            children: [
                              {
                                button: {
                                  className: `nav-link pe-2 dropdown-toggle ${
                                    getShowDropdown() ? 'show' : ''
                                  }`,
                                  onclick: (ev) => {
                                    setShowDropdown(!getShowDropdown());
                                  },

                                  children: () =>
                                    getState('user.name')
                                      ? {
                                          i: {
                                            className:
                                              'bi bi-person-check-fill',
                                            children: [
                                              {
                                                span: {
                                                  className: 'user-name',
                                                  text: () =>
                                                    getState('user.name'),
                                                },
                                              },
                                            ],
                                          },
                                        } // i.                              {
                                      : {
                                          i: {
                                            className: 'bi bi-person-x',
                                            children: {
                                              span: {
                                                className: 'user-name',
                                                text: 'Invitado',
                                              },
                                            },
                                          },
                                        }, // i.
                                },
                              },
                              {
                                div: {
                                  className: () =>
                                    `dropdown-menu dropdown-menu-end mt-3 ${
                                      getShowDropdown() ? ' show' : ''
                                    }`,
                                  children: () =>
                                    getState('user.name')
                                      ? {
                                          a: {
                                            className: 'dropdown-item',
                                            href: '/logout',
                                            text: 'Logout',
                                            disabled: () =>
                                              currentPath === '/login',
                                            onclick: (ev) => {
                                              ev.preventDefault();
                                              setShowDropdown(false);
                                              User.logout();
                                              Navigation.replace('/');
                                            },
                                          },
                                        }
                                      : {
                                          a: {
                                            className: () =>
                                              `dropdown-item ${
                                                currentPath === '/login'
                                                  ? 'active'
                                                  : ''
                                              }`,
                                            href: '/login',
                                            text: 'Login',
                                            disabled: () =>
                                              currentPath === '/login',
                                            onclick: (ev) => {
                                              ev.preventDefault();
                                              setShowDropdown(false);
                                              Navigation.push('/login');
                                            },
                                          },
                                        },
                                },
                              }, // ul.
                            ],
                          },
                        },
                      ],
                    },
                  }, // div.
                ],
              },
            }, // nav.
            {
              h1: {
                text: () => getState('title'),
              }, // h1
            },
          ],
        },
      };
    },
  })
);
