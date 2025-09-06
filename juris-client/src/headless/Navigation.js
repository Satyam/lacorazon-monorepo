import juris from '@src/jurisInstance.js';

juris.registerHeadlessComponent(
  'Navigation',
  (props, { setState }) => {
    let previous = null;
    const setURL = (path) => {
      if (path !== '/login') previous = path;
      const parts = path.substring(1).split('/');
      setState('url.path', path);
      setState('url.service', parts[0]);
      setState('url.param', parts[1]);
    };
    const handleUrlChange = () => {
      setURL(window.location.pathname);
    };

    return {
      hooks: {
        onRegister: () => {
          handleUrlChange();

          window.addEventListener('popstate', handleUrlChange);
        },

        onUnregister: () => {
          window.removeEventListener('popstate', handleUrlChange);
        },
      },
      api: {
        push: (path) => {
          history.pushState({ path }, '', path);
          setURL(path);
        },
        replace: (path) => {
          history.replaceState({ path }, '', path);
          setURL(path);
        },
        back: function () {
          if (previous) {
            history.back();
          } else {
            this.replace('/');
          }
        },
      },
    };
  },
  { autoInit: true }
);
