// TODO: use Conditional

juris.registerComponent('NavItem', ({ href, text, hidden = false }, {}) => ({
  render: () => ({
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
  }),
}));

juris.registerComponent(
  'NavBar',
  (props, { getState, setState, Navigation, DataApi, newState, User }) => ({
    render: () => {
      const [getCollapsed, setCollapsed] = newState('collapsed', false);
      const [getShowDropdown, setShowDropdown] = newState(
        'showDropdown',
        false
      );
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
                          getCollapsed() ? '' : 'show'
                        }`,
                      children: [
                        {
                          ul: {
                            className: 'navbar-nav',
                            children: [
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
                            ],
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
                                    `dropdown-menu dropdown-menu-right ${
                                      getShowDropdown() ? ' show' : ''
                                    }`,
                                  children: () =>
                                    getState('user.name')
                                      ? {
                                          div: {
                                            className: 'dropdown-item',
                                            href: '/logout',
                                            text: 'Logout',
                                            onclick: () => {
                                              User.logout();
                                              Navigation.replace('/');
                                            },
                                          },
                                        }
                                      : {
                                          div: {
                                            className: 'dropdown-item',
                                            href: '/login',
                                            text: 'Login',
                                            onclick: () => {
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
              p: {
                text: () => `Collapsed ${getCollapsed()}`,
              },
            },
            {
              p: {
                text: () => `dropdown menu ${getShowDropdown()}`,
              },
            },
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
