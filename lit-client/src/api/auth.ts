import { apiFetch } from './apiService';

export type SafeUserData = Omit<User, 'password'>;
export type CurrentUser = SafeUserData | null;
export type LoginInfo = Pick<User, 'email' | 'password'>;

const isLoggedInOp = (options?: OptionsType): OPERATION<undefined> => ({
  service: 'auth',
  op: 'isLoggedIn',
  options,
});

const currentUserOp = (
  data: LoginInfo,
  options?: OptionsType
): OPERATION<LoginInfo> => ({
  service: 'auth',
  op: 'login',
  data,
  options,
});

const logoutOp = (options?: OptionsType): OPERATION<undefined> => ({
  service: 'auth',
  op: 'logout',
  options,
});

export const apiGetCurrentUser = (data: LoginInfo, options?: OptionsType) =>
  apiFetch<LoginInfo, SafeUserData>(currentUserOp(data, options));

export const apiLogout = (options?: OptionsType) => apiFetch(logoutOp(options));

export const apiIsLoggedIn = (options?: OptionsType) =>
  apiFetch<undefined, SafeUserData>(isLoggedInOp(options));
