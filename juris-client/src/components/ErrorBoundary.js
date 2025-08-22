function handleGlobalError(event) {
  setState('app.error', {
    message: event.error.message,
    stack: event.error.stack,
    timestamp: Date.now(),
    type: 'javascript',
  });
}

function handlePromiseRejection(event) {
  setState('app.error', {
    message: event.reason.message || 'Promise rejection',
    stack: event.reason.stack || '',
    timestamp: Date.now(),
    type: 'promise',
  });
}

juris.registerComponent('ErrorBoundary', (props, context) => ({
  hooks: {
    onMount: () => {
      // Set up global error handler
      window.addEventListener('error', handleGlobalError);
      window.addEventListener('unhandledrejection', handlePromiseRejection);
    },

    onUnmount: () => {
      window.removeEventListener('error', handleGlobalError);
      window.removeEventListener('unhandledrejection', handlePromiseRejection);
    },
  },

  render: () => {
    const { getState, setState } = context;
    const error = getState('app.error');
    const isRecovering = getState('app.isRecovering', false);

    if (error && !isRecovering) {
      return {
        div: {
          className: 'error-boundary',
          children: [
            { h2: { text: 'Something went wrong' } },
            { p: { text: error.message } },
            {
              details: {
                children: [
                  { summary: { text: 'Error Details' } },
                  { pre: { text: error.stack } },
                ],
              },
            },
            {
              div: {
                className: 'error-actions',
                children: [
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
          ],
        },
      };
    }
  },
}));

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
