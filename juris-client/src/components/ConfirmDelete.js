juris.registerComponent(
  'ConfirmDelete',
  ({ onConfirma, onCancela, descr }) => ({
    render: () => ({
      Modal: {
        headerVariant: 'danger',
        closeText: 'Cancelar',
        onClose: onCancela,
        header: {
          i: {
            className: 'bi bi-exclamation-triangle',
            text: '¿Confirma borrado?',
          }, // i>
        }, // header
        body: {
          p: { text: `¿Está seguro que desea borrar ${descr} ?` },
        }, // body
        footer: {
          button: {
            type: 'button',
            className: 'btn btn-danger',
            onClick: onConfirma,
            children: {
              i: {
                className: 'bi trash',
                text: 'Borrar',
              },
            }, // i>
          },
        },
      }, // Modal
    }),
  })
);
