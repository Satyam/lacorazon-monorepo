/**
 * @param {Object} props
 * @param {import('@types').JurisContextBase} context
 * @returns {import('@types').JurisVDOMElement}
 */
export const Home = (props, context) => {
  return {
    h1: {
      children: [
        'Bienvenido',
        { pre: { children: JSON.stringify(context.getState('url', '??')) } },
      ],
    }, //h1
  };
};
