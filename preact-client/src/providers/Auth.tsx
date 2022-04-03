import { h, createContext, ComponentChildren } from 'preact';

import { useState, useContext } from 'preact/hooks';

import {
  apiLogin,
  apiLogout,
  apiIsLoggedIn,
  LoginInfo,
  CurrentUser,
} from '@lacorazon/post-client';

export const LOGIN_EVENT: 'loginEvent' = 'loginEvent' as const;

export class LoginEvent extends Event {
  currentUser: CurrentUser;
  constructor(currentUser: CurrentUser) {
    super(LOGIN_EVENT);
    this.currentUser = currentUser;
  }
}

declare global {
  interface WindowEventMap {
    [LOGIN_EVENT]: LoginEvent;
  }
}
type AuthType = {
  currentUser: CurrentUser;
  login: (data: LoginInfo) => Promise<CurrentUser>;
  logout: () => Promise<void>;
  isLoggedIn: () => Promise<CurrentUser>;
};

const notImplemented = () => {
  throw new Error('Authorization Context not ready yet');
};

const initialValues: AuthType = {
  currentUser: null,
  login: notImplemented,
  logout: notImplemented,
  isLoggedIn: notImplemented,
};

export const AuthContext = createContext<AuthType>(initialValues);

export const AuthProvider = ({ children }: { children: ComponentChildren }) => {
  const [currentUser, setCurrentUser] = useState<CurrentUser>(null);

  const login = (data: LoginInfo) =>
    apiLogin(data).then((user) => {
      setCurrentUser(user);
      window.dispatchEvent(new LoginEvent(user));
      setTimeout(isLoggedIn, 1_800_000);
      return user;
    });
  const logout = () =>
    apiLogout().then(() => {
      setCurrentUser(null);
      location.replace('/');
    });
  const isLoggedIn = () =>
    apiIsLoggedIn().then((user) => {
      if (user) {
        if (user !== currentUser) {
          setCurrentUser(user);
          window.dispatchEvent(new LoginEvent(currentUser));
          setTimeout(isLoggedIn, 1_800_000);
        }
      } else {
        if (currentUser) {
          setCurrentUser(null);
          window.dispatchEvent(new LoginEvent(null));
          setTimeout(logout, 0);
        }
      }
      return user;
    });
  const ctx = {
    currentUser,
    login,
    logout,
    isLoggedIn,
  };

  return <AuthContext.Provider value={ctx}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  return useContext(AuthContext);
}
