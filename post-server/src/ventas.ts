import {
  TABLE_VENTAS,
  TABLE_VENDEDORES,
  getDb,
  createWithAutoId,
  updateById,
  deleteById,
  formatReply,
} from './utils.js';

export default {
  list: ({ options }: { options?: { idVendedor: ID } }) =>
    formatReply(
      getDb().then((db) =>
        options?.idVendedor
          ? db.all(
              `select * from ${TABLE_VENTAS} where idVendedor = $idVendedor order by fecha, id`,
              {
                $idVendedor: options.idVendedor,
              }
            )
          : db.all(
              `select ${TABLE_VENTAS}.*, ${TABLE_VENDEDORES}.nombre as vendedor from ${TABLE_VENTAS}
              left join ${TABLE_VENDEDORES} on ${TABLE_VENTAS}.idVendedor = ${TABLE_VENDEDORES}.id  
              order by fecha, id`
            )
      )
    ),
  remove: ({ id }: { id: ID }) => deleteById(TABLE_VENTAS, id),
  get: ({ id }: { id: ID }) =>
    formatReply(
      getDb().then((db) =>
        db.get(
          `select ${TABLE_VENTAS}.*, ${TABLE_VENDEDORES}.nombre as vendedor from ${TABLE_VENTAS}
        left join ${TABLE_VENDEDORES} on ${TABLE_VENTAS}.idVendedor = ${TABLE_VENDEDORES}.id  
        where ${TABLE_VENTAS}.id = $id`,
          { $id: id }
        )
      )
    ),
  create: ({ data }) => createWithAutoId(TABLE_VENTAS, data),
  update: ({ id, data }) => updateById(TABLE_VENTAS, id, data),
} as Resolvers<Venta, { idVendedor: ID }>;
