import cuid from 'cuid';
import { open, Database, ISqlite } from 'sqlite';
import sqlite3 from 'sqlite3';

export const TABLE_VENTAS = 'Ventas';
export const TABLE_VENDEDORES = 'Vendedores';
export const TABLE_DISTRIBUIDORES = 'Distribuidores';
export const TABLE_SALIDAS = 'Salidas';
export const TABLE_USERS = 'Users';
export const TABLE_CONSIGNA = 'Consigna';

const NOT_FOUND = {
  error: 404,
  data: 'not found',
};

let _db: Promise<Database>;
export function getDb() {
  return (
    _db ??
    (_db = open({
      filename: process.env.DATABASE || ':memory:',
      driver: sqlite3.Database,
    }))
  );
}

export function formatReply<T>(q: Promise<T | undefined>): ApiReply<T> {
  return q
    .then((data) => (data ? { data } : NOT_FOUND))
    .catch((err) => ({
      error: err.code,
      data: err.message,
    }));
}

export function listAll<T>(
  nombreTabla: string,
  camposSalida?: string[]
): ApiReply<T> {
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
): ApiReply<T> {
  return rawGetById<T>(nombreTabla, id, camposSalida)
    .then((data) => {
      return data ? { data } : NOT_FOUND;
    })
    .catch((err) => ({
      error: err.code,
      data: err.message,
    }));
}

function replyOneChange<T>(
  nombreTabla: string,
  id: ID | null,
  query: (db: Database) => Promise<ISqlite.RunResult>,
  camposSalida?: string[]
): ApiReply<T> {
  return formatReply<T>(
    getDb()
      .then(query)
      .then((response) =>
        response.changes === 1
          ? rawGetById<T>(nombreTabla, id ?? response.lastID ?? 0, camposSalida)
          : Promise.reject({
              code: 304,
              message: 'no changes made',
            })
      )
  );
}

export function createWithAutoId<T>(
  nombreTabla: string,
  fila: Partial<T & { id: ID }>,
  camposSalida?: string[]
): ApiReply<T> {
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
): ApiReply<T> {
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
): ApiReply<T> {
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

export function deleteById(nombreTabla: string, id: ID): ApiReply<null> {
  return getDb().then((db) =>
    db
      .run(`delete from ${nombreTabla} where id = ?`, [id])
      .then((response) => (response.changes === 1 ? { data: null } : NOT_FOUND))
      .catch((err) => ({
        error: err.code,
        data: err.message,
      }))
  );
}
