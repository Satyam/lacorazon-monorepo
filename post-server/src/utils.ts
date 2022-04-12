import cuid from 'cuid';
import { open, Database } from 'sqlite';
import sqlite3, { RunResult } from 'sqlite3';

import { join } from 'path';

export const TABLE_VENTAS = 'Ventas';
export const TABLE_VENDEDORES = 'Vendedores';
export const TABLE_DISTRIBUIDORES = 'Distribuidores';
export const TABLE_SALIDAS = 'Salidas';
export const TABLE_USERS = 'Users';
export const TABLE_CONSIGNA = 'Consigna';

const NOT_FOUND = 404;

let _db: Database;

export function formatReply<T>(q: Promise<T>): Promise<ApiReply<T>> {
  return q
    .then((data) => ({ data }))
    .catch((err) => ({
      error: err.code,
      data: err.message,
    }));
}

export function getDb() {
  return _db
    ? Promise.resolve(_db)
    : open({
        filename: join(process.cwd(), 'data', 'db.sqlite'),
        driver: sqlite3.Database,
      }).then((db) => {
        _db = db;
        // un-comment the following to show statements
        // db.on('trace', (data) => {
        //   console.log(JSON.stringify(data, null, 2));
        // });
        return db;
      });
}

export function listAll<T>(nombreTabla: string, camposSalida?: string[]) {
  return formatReply<T>(
    getDb().then((db) =>
      db.all<T>(
        `select ${
          camposSalida ? camposSalida.join(',') : '*'
        } from ${nombreTabla}`
      )
    )
  );
}

export function rawGetById<T>(
  nombreTabla: string,
  id: ID,
  camposSalida?: string[]
) {
  const f = camposSalida ? camposSalida.join(',') : '*';
  return getDb().then((db) =>
    db.get<T>(`select ${f} from ${nombreTabla} where id = ?`, [id])
  );
}

export function getById<T>(
  nombreTabla: string,
  id: ID,
  camposSalida?: string[]
) {
  return rawGetById<T>(nombreTabla, id, camposSalida)
    .then((data) => {
      if (data) return { data };
      return Promise.reject({ code: 404, message: 'Not found' });
    })
    .catch((err) => ({
      error: err.code,
      data: err.message,
    }));
}

function replyOneChange<T>(
  nombreTabla: string,
  id: ID | null,
  query: (db: Database) => Promise<RunResult>,
  camposSalida?: string[]
) {
  return formatReply<T>(
    getDb()
      .then(query)
      .then((response) =>
        response.changes === 1
          ? rawGetById<T>(nombreTabla, id ?? response.lastID, camposSalida)
          : Promise.reject({
              code: SQLITE_ERROR,
              message: 'No changes made',
            })
      )
  );
}

export function createWithAutoId<T>(
  nombreTabla: string,
  fila: Partial<T & { id: ID }>,
  camposSalida?: string[]
) {
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
}

export function createWithCuid<T>(
  nombreTabla: string,
  fila: Partial<T & { id: ID }>,
  camposSalida?: string[]
) {
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
}

export function updateById<T>(
  nombreTabla: string,
  id: ID,
  fila: T,

  camposSalida?: string[]
) {
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
}

export function deleteById(nombreTabla: string, id: ID) {
  return getDb().then((db) =>
    db
      .run(`delete from ${nombreTabla} where id = ?`, [id])
      .then((response) =>
        response.changes === 1
          ? {}
          : {
              error: NOT_FOUND,
              data: 'not found',
            }
      )
      .catch((err) => ({
        error: err.code,
        data: err.message,
      }))
  );
}
