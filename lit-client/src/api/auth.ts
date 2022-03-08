export const isLoggedInOp = (options?: OptionsType): OPERATION<undefined> => ({
  service: 'auth',
  op: 'isLoggedIn',
  options,
});

export type CurrentUser = Omit<User, 'password'> | null;
export type LoginInfo = Pick<User, 'email' | 'password'>;

export const currentUserOp = (
  data: LoginInfo,
  options?: OptionsType
): OPERATION<LoginInfo> => ({
  service: 'auth',
  op: 'login',
  data,
  options,
});

export const logoutOp = (options?: OptionsType): OPERATION<undefined> => ({
  service: 'auth',
  op: 'logout',
  options,
});
