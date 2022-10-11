import apiFetch from './apiFetch.js';

export type SafeUserData = Omit<User, 'password'>;
export type CurrentUser = SafeUserData | null;
export type LoginInfo = Pick<User, 'email' | 'password'>;

export const AUTH_SERVICE = 'auth';

export const apiLogin = (loginInfo: LoginInfo) =>
  apiFetch<User>(`${AUTH_SERVICE}/login`, {
    method: 'POST',
    body: JSON.stringify(loginInfo),
    headers: { 'Content-Type': 'application/json' },
  });

export const apiLogout = () =>
  apiFetch<undefined>(`${AUTH_SERVICE}/logout`, { method: 'POST' });

export const apiCurrentUser = () =>
  apiFetch<boolean>(`${AUTH_SERVICE}/currentUser`);
