import { Database } from 'sqlite';
import { deleteById, TABLE_USERS } from './utils.js';
import { hashPassword } from './auth.js';
import { ServerError, ERRORS } from './serverError.js';

import cuid from 'cuid';

const hashPasswordInRow = (data: Partial<User>) =>
  data.password
    ? {
        ...data,
        password: hashPassword(data.password),
      }
    : data;

export const checkValidUser = (db: Database, user: User) =>
  db.get(
    `select id, nombre, email
     from ${TABLE_USERS} where lower(email) = lower(?) and password = ?`,
    [user.email, hashPassword(user.password)]
  );

export const listUsers = (db: Database) =>
  db.all<User>(`select id, nombre, email from ${TABLE_USERS}`);

export const getUser = (db: Database, id: ID) =>
  db.get<User>(`select id, nombre, email from ${TABLE_USERS} where id = ?`, [
    id,
  ]);

export const createUser = async (db: Database, user: User) => {
  const id = cuid();
  const { id: _, ...rest } = user;
  const fields = Object.keys(rest);
  const values = Object.values(hashPasswordInRow(rest));
  if (fields.length === 0) {
    throw new ServerError(ERRORS.BAD_REQUEST, 'No data to insert');
  }

  try {
    const { changes } = await db.run(
      `insert into ${TABLE_USERS} (id, ${fields.join(',')}) values (${Array(
        fields.length + 1
      )
        .fill('?')
        .join(',')})`,
      [id, ...values]
    );
    return changes === 1 ? getUser(db, id) : undefined;
  } catch (err) {
    console.log(err);
    // @ts-ignore
    if (err.errno === 19) {
      throw new ServerError(
        ERRORS.CONFLICT,
        // @ts-ignore
        err.toString().replace('Error: SQLITE_CONSTRAINT: ', '')
      );
    }
    throw err;
  }
};

export const updateUser = async (db: Database, id: ID, user: User) => {
  const fields = Object.keys(user);
  const values = Object.values(hashPasswordInRow(user));
  if (fields.length === 0) {
    throw new ServerError(ERRORS.BAD_REQUEST, 'No data to update');
  }

  try {
    const { changes } = await db.run(
      `update ${TABLE_USERS}  set (${fields.join(',')}) = (${Array(
        fields.length
      )
        .fill('?')
        .join(',')})  where id = ?`,
      [...values, id]
    );
    return changes ? getUser(db, id) : undefined;
  } catch (err) {
    console.log(err);
    // @ts-ignore
    if (err.errno === 19) {
      throw new ServerError(
        ERRORS.CONFLICT,
        // @ts-ignore
        err.toString().replace('Error: SQLITE_CONSTRAINT: ', '')
      );
    }
    throw err;
  }
};

export const deleteUser = (db: Database, id: ID) =>
  deleteById(db, TABLE_USERS, id);
