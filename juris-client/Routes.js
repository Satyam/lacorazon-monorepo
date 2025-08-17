/**
 * @param {Object} props
 * @param {import('@types').JurisContextBase} context
 * @returns {import('@types').JurisVDOMElement}
 */

import { Home } from './pages/Home';
export const Routes = (props, { getState }) => {
  return {
    render: () => ({
      div: {
        children: () => {
          const path = getState('url.service', '/');

          switch (path) {
            case '/':
              return [{ Home: {} }];
            case '/about':
              return [{ AboutPage: {} }];
            default:
              return [{ NotFoundPage: {} }];
          }
        },
      },
    }),
  };
};

export default Routes;
