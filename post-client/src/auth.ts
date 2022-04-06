import apiFetch from './apiFetch';

export type SafeUserData = Omit<User, 'password'>;
export type CurrentUser = SafeUserData | null;
export type LoginInfo = Pick<User, 'email' | 'password'>;

export const AUTH_SERVICE = 'auth';

export const apiLogin = (data: LoginInfo, options?: OptionsType) =>
  apiFetch<LoginInfo, CurrentUser>({
    service: AUTH_SERVICE,
    op: 'login',
    data,
    options,
  });

export const apiLogout = (options?: OptionsType) =>
  apiFetch({
    service: AUTH_SERVICE,
    op: 'logout',
    options,
  });

export const apiIsLoggedIn = (options?: OptionsType) =>
  apiFetch<undefined, CurrentUser>({
    service: AUTH_SERVICE,
    op: 'isLoggedIn',
    options,
  });
