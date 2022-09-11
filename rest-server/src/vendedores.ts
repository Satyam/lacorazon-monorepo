import { Database } from 'sqlite';
import {
  getById,
  listAll,
  createWithCuid,
  updateById,
  deleteById,
  TABLE_VENTAS,
} from './utils.js';

export const listVendedores = (db: Database) =>
  listAll<Vendedor[]>(db, TABLE_VENTAS);
export const getVendedor = (db: Database, id: ID) =>
  getById<Vendedor>(db, TABLE_VENTAS, id);
export const createVendedor = (db: Database, vendedor: Vendedor) =>
  createWithCuid<Vendedor>(db, TABLE_VENTAS, vendedor);
export const updateVendedor = (db: Database, id: ID, vendedor: Vendedor) =>
  updateById<Vendedor>(db, TABLE_VENTAS, id, vendedor);
export const deleteVendedor = (db: Database, id: ID) =>
  deleteById(db, TABLE_VENTAS, id);
