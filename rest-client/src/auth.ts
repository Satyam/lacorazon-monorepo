import apiFetch from './apiFetch';

export type SafeUserData = Omit<User, 'password'>;
export type CurrentUser = SafeUserData | null;
export type LoginInfo = Pick<User, 'email' | 'password'>;

export const AUTH_SERVICE = 'auth';

export const apiLogin = (loginInfo: LoginInfo) =>
  apiFetch<User>(`/api/${AUTH_SERVICE}/login`, { body: loginInfo as BodyInit });

export const apiLogout = () =>
  apiFetch<undefined>(`/api/${AUTH_SERVICE}/logout`);

export const apiIsLoggedIn = () =>
  apiFetch<boolean>(`/api/${AUTH_SERVICE}/isLoggedInlogin`);
