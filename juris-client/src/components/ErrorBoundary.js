juris.registerComponent(
  'ErrorBoundary',
  (props, { getState, setState, Modal, Conditional }) => {
    function handleGlobalError(event) {
      event.preventDefault();
      console.log('Got Global error', event.error.message);
      setState('app.error', {
        message: event.error.message,
        stack: event.error.stack,
        timestamp: Date.now(),
        type: 'javascript',
      });
    }

    function handlePromiseRejection(event) {
      event.preventDefault();
      console.log('Got unhandled promise', event.reason.message);
      setState('app.error', {
        message: event.reason.message || 'Promise rejection',
        stack: event.reason.stack || '',
        timestamp: Date.now(),
        type: 'promise',
      });
    }
    return {
      hooks: {
        onMount: () => {
          // Set up global error handler
          window.addEventListener('error', handleGlobalError);
          window.addEventListener('unhandledrejection', handlePromiseRejection);
        },

        onUnmount: () => {
          window.removeEventListener('error', handleGlobalError);
          window.removeEventListener(
            'unhandledrejection',
            handlePromiseRejection
          );
        },
      },

      render: () => {
        const error = getState('app.error', false);
        const isRecovering = getState('app.isRecovering', false);

        return {
          Conditional: {
            condition: () => error && !isRecovering,
            whenTrue: {
              Modal: {
                headerVariant: 'danger',
                header: { h2: { text: 'Something went wrong' } },
                body: [
                  { p: { children: error.message } },
                  {
                    details: {
                      children: [
                        { summary: { text: 'Error Details' } },
                        { pre: { text: error.stack } },
                      ],
                    },
                  },
                ],
                footer: [
                  {
                    button: {
                      text: 'Try Again',
                      onclick: () => {
                        setState('app.isRecovering', true);
                        setTimeout(() => {
                          setState('app.error', null);
                          setState('app.isRecovering', false);
                        }, 500);
                      },
                    },
                  },
                  {
                    button: {
                      text: 'Reload Page',
                      onclick: () => window.location.reload(),
                    },
                  },
                ],
              },
            },
            whenFalse: 'no error',
          },
        };
      },
    };
  }
);

/*
    // Normal rendering with error protection
    try {
      return {
        div: {
          className: 'app-content',
          children: Array.isArray(props.children)
            ? props.children
            : [props.children],
        },
      };
    } catch (renderError) {
      setState('app.error', {
        message: renderError.message,
        stack: renderError.stack,
        timestamp: Date.now(),
      });
      return { div: { text: 'Loading...' } };
    }
 */
