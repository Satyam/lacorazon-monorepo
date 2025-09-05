import juris from '@src/juris.js';

export const TableRowButtons = juris.registerComponent(
  'TableRowButtons',
  ({ action, id, message }, { getState }) => ({
    render: () => ({
      div: {
        className: 'btn-group btn-group-sm',
        role: 'group',
        children: [
          {
            button: {
              className: 'btn btn-outline-info',
              title: 'Ver detalle',
              onClick: () => action('show', id),
              children: {
                i: {
                  className: 'bi bi-eye',
                },
              },
            },
          },

          {
            button: {
              className: 'btn btn-outline-secondary',
              title: 'Modificar',
              onClick: () => action('edit', id),
              children: {
                i: {
                  className: 'bi bi-pencil',
                },
              },
            },
          },

          {
            button: {
              className: 'btn btn-outline-danger',
              title: 'Borrar',

              onClick: () => action('delete', id, message),
              children: {
                i: {
                  className: 'bi bi-trash',
                },
              },
            },
          },
        ],
      },
    }),
  })
);

juris.registerComponent(
  'DetailsButtonSet',
  ({ onDelete, isNew }, { getState }) => ({
    render: () =>
      isNew
        ? {
            button: {
              className: 'btn btn-primary',
              type: 'submit',
              children: {
                i: {
                  className: 'bi bi-plus',
                  text: 'Agregar',
                },
              },
            },
          }
        : {
            div: {
              children: [
                {
                  button: {
                    className: 'btn btn-primary',
                    type: 'submit',
                    children: {
                      i: {
                        className: 'bi bi-pencil',
                        text: 'Modificar',
                      },
                    },
                  },
                },
                {
                  button: {
                    className: 'btn btn-outline-danger',
                    title: 'Borrar',
                    // onClick: "{act('delete')}",
                    children: {
                      i: {
                        className: 'bi bi-trash',
                      },
                    },
                  },
                },
              ],
            },
          },
  })
);
