juris.registerComponent(
  'Conditional',
  ({ condition, whenTrue, whenFalse, tagName, ...extra }, context) => ({
    render: () => ({
      [tagName ?? 'div']: {
        ...extra,
        children: () => {
          if (typeof condition === 'function' ? condition() : condition) {
            return whenTrue
              ? Array.isArray(whenTrue)
                ? whenTrue
                : [whenTrue]
              : [];
          }

          return whenFalse
            ? Array.isArray(whenFalse)
              ? whenFalse
              : [whenFalse]
            : [];
        },
      },
    }),
  })
);
