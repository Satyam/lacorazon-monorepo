import juris from '@src/jurisInstance.js';
import '@components/Modal.js';

export const CONFIRM_DELETE = 'confirmDelete';
export const CONFIRM_DELETE_MESSAGE = 'confirmDelete.message';
export const CONFIRM_DELETE_RESULT = 'confirmDelete.result';
export const CONFIRM_DELETE_RESULT_CONFIRM = 'confirm';
export const CONFIRM_DELETE_RESULT_CANCEL = 'cancel';

juris.registerComponent('ConfirmDelete', ({}, { getState, setState }) => ({
  render: () =>
    getState(CONFIRM_DELETE, false)
      ? {
          Modal: {
            headerVariant: 'danger',
            closeText: 'Cancelar',
            onClose: () =>
              setState(CONFIRM_DELETE_RESULT, CONFIRM_DELETE_RESULT_CANCEL),
            header: {
              i: {
                className: 'bi bi-exclamation-triangle',
                text: '¿Confirma borrado?',
              }, // i>
            }, // header
            body: {
              p: {
                text: () =>
                  `¿Está seguro que desea borrar ${getState(
                    CONFIRM_DELETE_MESSAGE
                  )} ?`,
              },
            }, // body
            footer: {
              button: {
                type: 'button',
                className: 'btn btn-danger',
                onClick: () =>
                  setState(
                    CONFIRM_DELETE_RESULT,
                    CONFIRM_DELETE_RESULT_CONFIRM
                  ),
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
}));
