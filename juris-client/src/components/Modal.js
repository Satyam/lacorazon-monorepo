juris.registerComponent(
  'Modal',
  (
    { header, body, footer, closeText, okText, className, onClose, onOk },
    context
  ) => ({
    render: () => ({
      div: {
        className: `modal ${className}`,
        tabindex: '-1',
        role: 'dialog',
        children: [
          {
            div: {
              className: 'modal-dialog',
              role: 'document',
              children: [
                {
                  div: {
                    className: 'modal-content',
                    children: [
                      header
                        ? {
                            div: {
                              className: 'modal-header',
                              children: [
                                {
                                  h5: {
                                    className: 'modal-title',
                                    children: header,
                                  },
                                }, // h5
                                closeText
                                  ? {
                                      button: {
                                        type: 'button',
                                        className: 'close',
                                        'data-dismiss': 'modal',
                                        'aria-label': 'Close',
                                        onClick: onClose,
                                        children: [
                                          {
                                            span: {
                                              'aria-hidden': 'true',
                                              text: '&times',
                                            },
                                          }, // span
                                        ],
                                      },
                                    }
                                  : null, // button
                              ],
                            },
                          }
                        : null, // div
                      {
                        div: { className: 'modal-body', children: body },
                      }, // div
                      footer || closeText || okText
                        ? {
                            div: {
                              className: 'modal-footer',
                              children: [
                                closeText
                                  ? {
                                      button: {
                                        type: 'button',
                                        className: 'btn btn-secondary',
                                        'data-dismiss': 'modal',
                                        onClick: onClose,
                                        children: closeText,
                                      },
                                    }
                                  : null, // button
                                okText
                                  ? {
                                      button: {
                                        type: 'button',
                                        className: 'btn btn-primary',
                                        onClick: onOk,
                                        children: okText,
                                      },
                                    }
                                  : null, // button
                              ],
                            },
                          }
                        : null, // div
                    ],
                  },
                }, // div
              ],
            },
          }, // div
        ],
      },
    }), // div
  })
);
