import juris from '@src/juris.js';

juris.registerComponent(
  'TableRowButtons',
  ({ action, id, descr }, { getState }) => ({
    render: () => ({
      div: {
        className: 'btn-group btn-group-sm',
        role: 'group',
        children: [
          {
            button: {
              className: 'btn btn-outline-info',
              title: 'Ver detalle',
              onClick: "{act('show')}",
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
              onClick: "{act('edit')}",
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
              onClick: "{act('delete')}",
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
                    onClick: "{act('delete')}",
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
