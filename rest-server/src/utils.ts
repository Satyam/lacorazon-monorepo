import cuid from 'cuid';
import { open, Database } from 'sqlite';
import sqlite3 from 'sqlite3';

export const TABLE_VENTAS = 'Ventas';
export const TABLE_VENDEDORES = 'Vendedores';
export const TABLE_DISTRIBUIDORES = 'Distribuidores';
export const TABLE_SALIDAS = 'Salidas';
export const TABLE_USERS = 'Users';
export const TABLE_CONSIGNA = 'Consigna';

sqlite3.verbose();

export const initDb = (filename: string = ':memory:') =>
  open({
    filename,
    driver: sqlite3.Database,
  });

export function getById<T>(db: Database, nombreTabla: string, id: ID) {
  return db.get<T>(`select * from ${nombreTabla} where id = ?`, [id]);
}

export function listAll<T>(db: Database, nombreTabla: string) {
  return db.all<T>(`select * from ${nombreTabla}`);
}

export async function createWithAutoId<T>(
  db: Database,
  nombreTabla: string,
  fila: Partial<T & { id: ID }>
) {
  const fields = Object.keys(fila);
  const values = Object.values(fila);

  const { lastID } = await db.run(
    `insert into ${nombreTabla} (${fields}) values (${Array(fields.length)
      .fill('?')
      .join(',')})`,
    values
  );
  return lastID ? getById<T>(db, nombreTabla, lastID) : undefined;
}

export async function createWithCuid<T>(
  db: Database,
  nombreTabla: string,
  fila: Partial<T & { id: ID }>
) {
  const id = cuid();
  const { id: _, ...rest } = fila;
  const fields = Object.keys(rest);
  const values = Object.values(rest);
  const { lastID } = await db.run(
    `insert into ${nombreTabla} (id, ${fields.join(',')}) values (${Array(
      fields.length + 1
    )
      .fill('?')
      .join(',')})`,
    [id, ...values]
  );
  return lastID ? getById<T>(db, nombreTabla, lastID) : undefined;
}

export async function updateById<T>(
  db: Database,
  nombreTabla: string,
  id: ID,
  fila: Partial<T & { id: ID }>
) {
  const fields = Object.keys(fila);
  const values = Object.values(fila);
  const { changes } = await db.run(
    `update ${nombreTabla}  set (${fields.join(',')}) = (${Array(fields.length)
      .fill('?')
      .join(',')})  where id = ?`,
    [...values, id]
  );
  return changes ? getById<T>(db, nombreTabla, id) : undefined;
}

export async function deleteById(db: Database, nombreTabla: string, id: ID) {
  const { changes } = await db.run(`delete from ${nombreTabla} where id = ?`, [
    id,
  ]);
  return changes === 1;
}
