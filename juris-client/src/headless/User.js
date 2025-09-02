import juris from '@src/juris.js';
import '@headless/DataApi.js';

juris.registerHeadlessComponent(
  'User',
  (props, { getState, setState, DataApi }) => {
    const clearUser = () => {
      setState('user.name', null);
      setState('user.email', null);
    };
    const handleUserError = ({ error, data }) => {
      clearUser();
      if (error === 401) {
        console.info('unauthorized');
        // setState('user.unauthorized', true);
      } else {
        console.error('other error', error, data);
        throw new Error(`Unexpected error in DataFetch [${error}] ${data}`);
      }
    };
    const handleUserData = ({ data }) => {
      setState('user.name', data.nombre);
      setState('user.email', data.email);
    };
    return {
      api: {
        isLoggedIn: () =>
          DataApi.isLoggedIn().then(handleUserData, handleUserError),
        login: (email, password) =>
          DataApi.login({ email, password }).then(
            handleUserData,
            handleUserError
          ),
        logout: () => DataApi.logout().then(clearUser, handleUserError),
      },
      hooks: {
        onRegister: () =>
          DataApi.isLoggedIn().then(handleUserData, handleUserError),
        onUnregister: () => DataApi.logout().then(clearUser, handleUserError),
      },
    };
  },
  { autoInit: true }
);
