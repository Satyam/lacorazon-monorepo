const APP_ERROR = 'app.error';
const APP_IS_RECOVERING = 'app.isRecovering';

import juris from '@src/juris.js';
import '@components/Modal.js';

juris.registerHeadlessComponent(
  'ErrorHandler',
  (props, { setState, executeBatch }) => {
    const handleGlobalError = (event) => {
      event.preventDefault();
      executeBatch(() => {
        setState(APP_ERROR, {
          message: event.error.message,
          stack: event.error.stack,
          timestamp: Date.now(),
          type: 'javascript',
        });
      });
    };

    const handlePromiseRejection = (event) => {
      event.preventDefault();
      executeBatch(() => {
        setState(APP_ERROR, {
          message: event.reason.message || 'Promise rejection',
          stack: event.reason.stack || '',
          timestamp: Date.now(),
          type: 'promise',
        });
      });
    };

    return {
      hooks: {
        onRegister: () => {
          window.addEventListener('error', handleGlobalError);
          window.addEventListener('unhandledrejection', handlePromiseRejection);
        },
        onUnregister: () => {
          window.removeEventListener('error', handleGlobalError);
          window.removeEventListener(
            'unhandledrejection',
            handlePromiseRejection
          );
        },
      },
    };
  },
  { autoInit: true }
);
juris.registerComponent('ErrorBoundary', (props, { getState, setState }) => ({
  render: () =>
    getState(APP_ERROR) && !getState(APP_IS_RECOVERING, false)
      ? {
          Modal: {
            headerVariant: 'danger',
            header: { h2: { text: 'Something went wrong' } },
            body: [
              { p: { text: getState(APP_ERROR).message } },
              {
                details: {
                  children: [
                    { summary: { text: 'Error Details' } },
                    { pre: { text: getState(APP_ERROR).stack } },
                  ],
                },
              },
            ],
            footer: [
              {
                button: {
                  class: 'btn btn-secondary',
                  text: 'Try Again',
                  onclick: () => {
                    setState(APP_IS_RECOVERING, true);
                    setTimeout(() => {
                      setState(APP_ERROR, null);
                      setState(APP_IS_RECOVERING, false);
                    }, 500);
                  },
                },
              },
              {
                button: {
                  class: 'btn btn-secondary',
                  text: 'Reload Page',
                  onclick: () => window.location.reload(),
                },
              },
            ],
          },
        }
      : null,
}));
