import {
  TABLE_USERS,
  listAll,
  getById,
  createWithAutoId,
  updateById,
  deleteById,
  getColl,
  defaultProjection,
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

export const hashPassword = (data: User) =>
  data.password
    ? {
        ...data,
        password: hash(data.password?.toLowerCase()),
      }
    : data;

export const checkValidUser = (email: string, password: string) =>
  getColl(TABLE_USERS)
    .aggregate<Omit<User, 'password'>>([
      {
        $match: {
          email,
          password: hash(password.toLowerCase()),
        },
      },
      ...defaultProjection,
    ])
    .toArray()
    .then((rows) => rows[0]);

const resolvers: Resolvers<User> = {
  list: () => listAll(TABLE_USERS),
  remove: ({ id }) => deleteById(TABLE_USERS, id),
  get: ({ id }) => getById(TABLE_USERS, id),
  create: ({ data }) => createWithAutoId(TABLE_USERS, hashPassword(data)),
  update: ({ id, data }) => updateById(TABLE_USERS, id, hashPassword(data)),
};

export default resolvers;
