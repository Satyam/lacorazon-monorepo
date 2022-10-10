import {
  apiCreate,
  apiDelete,
  apiGet,
  apiList,
  apiUpdate,
} from './apiFetch.js';

export const USERS_SERVICE = 'users';

export const apiListUsers = () => apiList<User[]>(USERS_SERVICE);

export const apiGetUser = (id: ID) => apiGet<User>(USERS_SERVICE, id);

export const apiCreateUser = (user: User) =>
  apiCreate<User>(USERS_SERVICE, user);

export const apiUpdateUser = (id: ID, user: User) =>
  apiUpdate<User>(USERS_SERVICE, id, user);

export const apiRemoveUser = (id: ID) => apiDelete(USERS_SERVICE, id);
