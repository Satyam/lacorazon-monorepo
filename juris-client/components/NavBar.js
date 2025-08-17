/**
 * @param {Object} props
 * @param {import('@types').JurisContextBase} context
 * @returns {import('@types').JurisVDOMElement}
 */
export const NavBar = (props, context) => {
  const { getState, setState } = context;

  return {
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
          },
        },
        {
          button: {
            className: 'navbar-toggler',
            type: 'button',
            children: [
              { span: { className: 'navbar-toggler-icon' } }, // span.
            ],
          },
        }, // button.
        {
          div: {
            className: 'collapse navbar-collapse',
            children: [
              {
                ul: {
                  className: 'navbar-nav me-auto logged-in',
                  children: [
                    {
                      li: {
                        className: 'nav-item',
                        children: [
                          {
                            a: {
                              className: 'nav-link',
                              href: '/usuarios',
                              children: ['Usuarios'],
                            },
                          }, // a.
                        ],
                      },
                    }, // li.
                    {
                      li: {
                        className: 'nav-item',
                        children: [
                          {
                            a: {
                              className: 'nav-link',
                              href: '/vendedores',
                              children: ['Vendedores'],
                            },
                          }, // a.
                        ],
                      },
                    }, // li.
                    {
                      li: {
                        className: 'nav-item',
                        children: [
                          {
                            a: {
                              className: 'nav-link',
                              href: '/distribuidores',
                              children: ['Distribuidores'],
                            },
                          }, // a.
                        ],
                      },
                    }, // li.
                    {
                      li: {
                        className: 'nav-item',
                        children: [
                          {
                            a: {
                              className: 'nav-link',
                              href: '/ventas',
                              children: ['Ventas'],
                            },
                          }, // a.
                        ],
                      },
                    }, // li.
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
                        children: [{ span: { className: 'user-name' } }],
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
                      li: {
                        className: 'nav-item logged-out',
                        children: [
                          {
                            a: {
                              className: 'nav-link',
                              href: '/login',
                              children: [' Login'],
                            },
                          }, // a.
                        ],
                      },
                    }, // li.
                    {
                      li: {
                        className: 'nav-item logged-in',
                        children: [
                          {
                            a: {
                              className: 'nav-link',
                              href: '/logout',
                              children: [' Logout'],
                            },
                          }, // a.
                        ],
                      },
                    }, // li.
                  ],
                },
              }, // ul.
            ],
          },
        }, // div.
      ],
    },
  }; // nav.
};

export default NavBar;
// <(\w+)\s           {$1:{
// <\/(\w+)\s?}       } // $1.
// (\w+)="([^"]*)"    $1: '$2',
// className:         className:
// />
