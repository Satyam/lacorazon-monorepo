// "auth": {
//       "loading": false,
//       "error": {
//         "error": 401,
//         "data": "Unauthorized"
//       }
//     }

juris.registerHeadlessComponent(
  'User',
  (props, { getState, setState, subscribe, DataApi }) => {
    const handleUserData = ({ error, data }) => {
      if (error) {
        clearUser();
        if (error === 401) {
          // Do something
        }
      } else {
        // Do something
      }
    };
    const clearUser = () => {
      setState('user.name', null);
      setState('user.email', null);
    };
    return {
      api: {
        isLoggedIn: async () => {
          handleUserData(await DataApi.isLoggedIn());
        },
        login: async (email, password) => {
          handleUserData(await DataApi.login({ email, password }));
        },
        logout: async () => {
          await DataApi.logout();
          clearUser();
        },
      },
      hooks: {
        onRegister: () => {
          console.log('User.onRegister isLoggedIn', DataApi.isLoggedIn());
        },
        onUnregister: async () => {
          await DataApi.logout();
          clearUser();
        },
      },
    };
  },
  { autoInit: true }
);
