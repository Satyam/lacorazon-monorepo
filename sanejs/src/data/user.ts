import type { Database } from 'sqlite';

const {
  TABLE_USERS,
  listAll,
  getById,
  createWithCuid,
  updateById,
  deleteById,
  getDb,
} = require('./utils.js');
const { createHmac } = require('crypto');

import type { DbFunctions } from './utils';

const hash = (data: string): string => {
  const hmac = createHmac(
    'sha256',
    process.env.SESSION_PASSWORD || 'alguna tontera'
  );
  hmac.update(data);
  return hmac.digest('hex');
};
const hashPassword = (data: User) =>
  data.password
    ? {
        ...data,
        password: hash(data.password?.toLowerCase()),
      }
    : data;

const safeFields = ['id', 'nombre', 'email'];

const dbFunctions: DbFunctions<User> = {
  list: () => listAll(TABLE_USERS, safeFields),
  remove: (id) => deleteById(TABLE_USERS, id),
  get: (id) => getById(TABLE_USERS, id, safeFields),
  create: (data) => createWithCuid(TABLE_USERS, hashPassword(data), safeFields),
  update: (id, data) =>
    updateById(TABLE_USERS, id, hashPassword(data), safeFields),
};

module.exports = {
  hash,

  hashPassword,
  checkValidUser: (email: string, password: string) =>
    getDb().then((db: Database) =>
      db.get(
        `select ${safeFields.join(',')}
     from ${TABLE_USERS} where lower(email) = lower(?) and password = ?`,
        [email, hash(password.toLowerCase())]
      )
    ),
  ...dbFunctions,
};
