import { Database } from 'sqlite';
import {
  getById,
  listAll,
  createWithCuid,
  updateById,
  deleteById,
  TABLE_VENTAS,
} from './utils.js';

export const listVentas = (db: Database) => listAll<Venta[]>(db, TABLE_VENTAS);
export const getVenta = (db: Database, id: ID) =>
  getById<Venta>(db, TABLE_VENTAS, id);
export const createVenta = (db: Database, fila: Venta) =>
  createWithCuid<Venta>(db, TABLE_VENTAS, fila);
export const updateVenta = (db: Database, id: ID, fila: Venta) =>
  updateById<Venta>(db, TABLE_VENTAS, id, fila);
export const deleteVenta = (db: Database, id: ID) =>
  deleteById(db, TABLE_VENTAS, id);