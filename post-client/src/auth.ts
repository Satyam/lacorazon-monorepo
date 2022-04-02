import apiFetch from './apiFetch';

export type SafeUserData = Omit<User, 'password'>;
export type CurrentUser = SafeUserData | null;
export type LoginInfo = Pick<User, 'email' | 'password'>;

const service = 'auth';

export const apiLogin = (data: LoginInfo, options?: OptionsType) =>
  apiFetch<LoginInfo, SafeUserData>({
    service,
    op: 'login',
    data,
    options,
  });

export const apiLogout = (options?: OptionsType) =>
  apiFetch({
    service,
    op: 'logout',
    options,
  });

export const apiIsLoggedIn = (options?: OptionsType) =>
  apiFetch<undefined, SafeUserData>({
    service,
    op: 'isLoggedIn',
    options,
  });
