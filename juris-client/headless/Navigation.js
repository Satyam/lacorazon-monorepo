/**
 * @param {Object} props
 * @param {import('@types').JurisContextBase} context
 * @returns {import('@types').HeadlessComponent}
 */

export const Navigation = {
  fn: (props, { setState }) => {
    return {
      hooks: {
        onRegister: () => {
          console.log('🧭 UrlStateSync initializing...');

          // Initialize from current URL
          handleUrlChange();

          // Listen for browser navigation (back/forward)
          // window.addEventListener('hashchange', handleUrlChange);
          window.addEventListener('popstate', handleUrlChange);

          console.log('✅ UrlStateSync ready');
        },

        onUnregister: () => {
          // window.removeEventListener('hashchange', handleUrlChange);
          window.removeEventListener('popstate', handleUrlChange);
        },
      },
      api: {
        push: (path) => {
          history.pushState({ path }, '', path);
        },
        replace: (path) => {
          history.replaceState({ path }, '', path);
        },
      },
    };

    function handleUrlChange() {
      const path = window.location.pathname;
      const parts = path.substring(1).split('/');

      // Inject URL state into global state
      setState('url.path', path);
      setState('url.service', parts[0]);
      setState('url.param', parts[1]);

      console.log('🧭 URL updated:', path);
    }
  },
  options: { autoInit: true },
};
export default Navigation;
