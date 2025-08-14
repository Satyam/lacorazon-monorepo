import { createContext, useState, useContext } from 'react';

import {
  apiLogin,
  apiLogout,
  apiIsLoggedIn,
  LoginInfo,
  CurrentUser,
} from '@lacorazon/post-client';

const SESSION_TIMEOUT = 1_800_000 as const;

type AuthType = {
  currentUser: CurrentUser;
  login: (data: LoginInfo) => Promise<CurrentUser>;
  logout: () => Promise<void>;
};

const notImplemented = () => {
  throw new Error('Authorization Context not ready yet');
};

const initialValues: AuthType = {
  currentUser: null,
  login: notImplemented,
  logout: notImplemented,
};

export const AuthContext = createContext<AuthType>(initialValues);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);

  const login = (data: LoginInfo) =>
    apiLogin(data).then((user) => {
      setCurrentUser(user);
      return user;
    });

  const stopAll = () => {
    setCurrentUser(null);
    if (timer) clearInterval(timer);
    setTimer(null);
    location.replace('/');
  };

  const logout = () => apiLogout().then(stopAll);

  const isLoggedIn = () =>
    apiIsLoggedIn()
      .then((user) => {
        if (user) {
          if (user.id !== currentUser?.id) setCurrentUser(user);
        } else {
          if (currentUser) stopAll();
        }
      })
      .catch(() => {
        if (currentUser) stopAll();
      });

  isLoggedIn();
  if (!timer && currentUser) setTimer(setInterval(isLoggedIn, SESSION_TIMEOUT));
  const ctx = {
    currentUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
