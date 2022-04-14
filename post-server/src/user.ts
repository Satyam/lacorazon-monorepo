import {
  TABLE_USERS,
  listAll,
  getById,
  createWithCuid,
  updateById,
  deleteById,
  getDb,
} from './utils.js';
import { createHmac } from 'crypto';

export function hash(data: string) {
  const hmac = createHmac(
    'sha256',
    process.env.SESSION_PASSWORD || 'alguna tontera'
  );
  hmac.update(data);
  return hmac.digest('hex');
}

const safeFields = ['id', 'nombre', 'email'];

export const hashPassword = (data: User) =>
  data.password
    ? {
        ...data,
        password: hash(data.password?.toLowerCase()),
      }
    : data;

export const checkValidUser = (email: string, password: string) =>
  getDb().then((db) =>
    db.get(
      `select ${safeFields.join(',')}
     from ${TABLE_USERS} where lower(email) = lower(?) and password = ?`,
      [email, hash(password.toLowerCase())]
    )
  );

export default {
  list: () => listAll(TABLE_USERS, safeFields),
  remove: ({ id }: { id: ID }) => deleteById(TABLE_USERS, id),
  get: ({ id }: { id: ID }) => getById(TABLE_USERS, id, safeFields),
  create: ({ data }: { data: User }) =>
    createWithCuid(TABLE_USERS, hashPassword(data), safeFields),
  update: ({ id, data }: { id: ID; data: User }) =>
    updateById(TABLE_USERS, id, hashPassword(data), safeFields),
} as Resolvers<User>;
