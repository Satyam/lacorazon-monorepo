import { Database } from 'sqlite';
import {
  updateById,
  deleteById,
  TABLE_VENTAS,
  TABLE_VENDEDORES,
  createWithAutoId,
} from './utils.js';

export const listVentas = (db: Database, idVendedor?: ID) =>
  idVendedor
    ? db.all<Venta>(
        `select * from ${TABLE_VENTAS} where idVendedor = $idVendedor order by fecha, id`,
        {
          $idVendedor: idVendedor,
        }
      )
    : db.all<VentaYVendedor>(
        `select ${TABLE_VENTAS}.*, ${TABLE_VENDEDORES}.nombre as vendedor from ${TABLE_VENTAS}
          left join ${TABLE_VENDEDORES} on ${TABLE_VENTAS}.idVendedor = ${TABLE_VENDEDORES}.id  
          order by fecha, id`,
        []
      );

export const getVenta = (db: Database, id: ID) =>
  db.get<VentaYVendedor>(
    `select ${TABLE_VENTAS}.*, ${TABLE_VENDEDORES}.nombre as vendedor from ${TABLE_VENTAS}
      left join ${TABLE_VENDEDORES} on ${TABLE_VENTAS}.idVendedor = ${TABLE_VENDEDORES}.id  
      where ${TABLE_VENTAS}.id = $id`,
    { $id: id }
  );
export const createVenta = (db: Database, venta: Venta) =>
  createWithAutoId<Venta>(db, TABLE_VENTAS, venta);
export const updateVenta = (db: Database, id: ID, venta: Venta) =>
  updateById<Venta>(db, TABLE_VENTAS, id, venta);
export const deleteVenta = (db: Database, id: ID) =>
  deleteById(db, TABLE_VENTAS, id);
