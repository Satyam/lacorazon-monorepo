/// <reference path="../../../types/global.d.ts" />

const cuid = require('cuid');
const { open } = require('sqlite');
const sqlite3 = require('sqlite3');
const { join } = require('path');
import type { Database, ISqlite } from 'sqlite';
export type DbFunctions<Data, Opts = unknown> = {
  list: (options: Opts) => Promise<Data>;
  remove: (id: ID) => Promise<null>;
  get: (id: ID) => Promise<Data>;
  create: (data: Data) => Promise<Data>;
  update: (id: ID, data: Data) => Promise<Data>;
};

let _db: Promise<Database>;

const getDb = () =>
  _db ??
  (_db = open({
    filename: join(__dirname, '../../data/db.sqlite'),
    driver: sqlite3.Database,
  }));

function rawGetById<T>(nombreTabla: string, id: ID, camposSalida?: string[]) {
  const f = camposSalida ? camposSalida.join(',') : '*';
  return getDb().then((db) =>
    db.get<T>(`select ${f} from ${nombreTabla} where id = ?`, [id])
  );
}

function replyOneChange<T>(
  nombreTabla: string,
  id: ID | null,
  query: (db: Database) => Promise<ISqlite.RunResult>,
  camposSalida?: string[]
): Promise<T | undefined> {
  return getDb()
    .then(query)
    .then((response) =>
      response.changes === 1
        ? rawGetById<T>(nombreTabla, id ?? response.lastID ?? 0, camposSalida)
        : Promise.reject({
            code: 304,
            message: 'no changes made',
          })
    );
}
module.exports = {
  TABLE_VENTAS: 'Ventas',
  TABLE_VENDEDORES: 'Vendedores',
  TABLE_DISTRIBUIDORES: 'Distribuidores',
  TABLE_SALIDAS: 'Salidas',
  TABLE_USERS: 'Users',
  TABLE_CONSIGNA: 'Consigna',
  getDb,
  rawGetById,
  listAll: <T>(nombreTabla: string, camposSalida?: string[]): Promise<T> =>
    getDb().then((db) =>
      db.all<T>(
        `select ${
          camposSalida ? camposSalida.join(',') : '*'
        } from ${nombreTabla}`
      )
    ),
  getById: <T>(
    nombreTabla: string,
    id: ID,
    camposSalida?: string[]
  ): Promise<T | undefined> => rawGetById<T>(nombreTabla, id, camposSalida),

  createWithAutoId: <T>(
    nombreTabla: string,
    fila: Partial<T & { id: ID }>,
    camposSalida?: string[]
  ): Promise<T | undefined> => {
    const { id: _, ...rest } = fila;
    const fields = Object.keys(rest);
    const values = Object.values(rest);
    return replyOneChange<T>(
      nombreTabla,
      null,
      (db) =>
        db.run(
          `insert into ${nombreTabla} (${fields}) values (${Array(fields.length)
            .fill('?')
            .join(',')})`,
          values
        ),
      camposSalida
    );
  },
  createWithCuid: <T>(
    nombreTabla: string,
    fila: Partial<T & { id: ID }>,
    camposSalida?: string[]
  ): Promise<T | undefined> => {
    const id = cuid();
    const { id: _, ...rest } = fila;
    const fields = Object.keys(rest);
    const values = Object.values(rest);
    return replyOneChange<T>(
      nombreTabla,
      id,
      (db) =>
        db.run(
          `insert into ${nombreTabla} (id, ${fields.join(',')}) values (${Array(
            fields.length + 1
          )
            .fill('?')
            .join(',')})`,
          [id, ...values]
        ),
      camposSalida
    );
  },

  updateById: <T>(
    nombreTabla: string,
    id: ID,
    fila: T,

    camposSalida?: string[]
  ): Promise<T | undefined> => {
    const fields = Object.keys(fila);
    const values = Object.values(fila);
    return replyOneChange(
      nombreTabla,
      id,
      (db) =>
        db.run(
          `update ${nombreTabla}  set (${fields.join(',')}) = (${Array(
            fields.length
          )
            .fill('?')
            .join(',')})  where id = ?`,
          [...values, id]
        ),
      camposSalida
    );
  },

  deleteById: (nombreTabla: string, id: ID): Promise<null> =>
    getDb().then((db) =>
      db.run(`delete from ${nombreTabla} where id = ?`, [id]).then((response) =>
        response.changes === 1
          ? null
          : Promise.reject({
              code: 404,
              message: 'record not found or just deleted',
            })
      )
    ),
};
