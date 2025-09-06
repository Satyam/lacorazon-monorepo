import juris from '@src/jurisInstance.js';
import '@headless/DataApi.js';
import '@headless/Navigation.js';
juris.registerHeadlessComponent(
  'User',
  (props, { getState, setState, DataApi, Navigation }) => {
    const clearUser = () => {
      setState('user.name', null);
      setState('user.email', null);
    };
    const handleUserData = (user) => {
      setState('user.name', user.nombre);
      setState('user.email', user.email);
    };
    return {
      api: {
        isLoggedIn: () => DataApi.isLoggedIn().then(handleUserData),
        login: (email, password) => {
          clearUser();
          return DataApi.login({ email, password }).then(handleUserData);
        },
        logout: () => {
          Navigation.push('/');
          return DataApi.logout().then(clearUser);
        },
      },
      hooks: {
        onRegister: () =>
          DataApi.isLoggedIn()
            .then(handleUserData)
            .catch(() => null),
        onUnregister: () => DataApi.logout().then(clearUser),
      },
    };
  },
  { autoInit: true }
);
