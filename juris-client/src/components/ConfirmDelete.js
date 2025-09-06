import juris from '@src/jurisInstance.js';
import '@components/Modal.js';

export const CONFIRM_DELETE = 'confirmDelete';

juris.registerComponent(
  'ConfirmDelete',
  ({}, { setState, newState, subscribe, executeBatch }) => {
    const [getOpen, setOpen] = newState('open', false);
    const [getMessage, setMessage] = newState('message', null);
    return {
      render: () =>
        getOpen()
          ? {
              Modal: {
                headerVariant: 'danger',
                closeText: 'Cancelar',
                onClose: () => setState(CONFIRM_DELETE, 'cancel'),
                header: {
                  i: {
                    className: 'bi bi-exclamation-triangle',
                    text: '¿Confirma borrado?',
                  }, // i>
                }, // header
                body: {
                  p: {
                    text: () =>
                      `¿Está seguro que desea borrar ${getMessage()} ?`,
                  },
                }, // body
                footer: {
                  button: {
                    type: 'button',
                    className: 'btn btn-danger',
                    onClick: () => setState(CONFIRM_DELETE, 'confirm'),
                    children: {
                      i: {
                        className: 'bi trash',
                        text: 'Borrar',
                      },
                    }, // i>
                  },
                },
              }, // Modal
            }
          : [],
      api: {
        confirm: (message, ...args) =>
          new Promise((resolve) => {
            setState(CONFIRM_DELETE, null);
            const unsubscribe = subscribe(CONFIRM_DELETE, (value) => {
              unsubscribe();
              executeBatch(() => {
                setOpen(false);
              });
              if (value) {
                resolve(args.length ? [value, ...args] : value);
              }
            });
            setMessage(message);
            setOpen(true);
          }),
      },
    };
  }
);
