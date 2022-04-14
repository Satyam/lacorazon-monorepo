import {
  TABLE_VENDEDORES,
  listAll,
  getById,
  createWithCuid,
  updateById,
  deleteById,
} from './utils.js';

export default {
  list: () => listAll(TABLE_VENDEDORES),
  remove: ({ id }: { id: ID }) => deleteById(TABLE_VENDEDORES, id),
  get: ({ id }: { id: ID }) => getById(TABLE_VENDEDORES, id),
  create: ({ data }: { data: Vendedor }) =>
    createWithCuid(TABLE_VENDEDORES, data),
  update: ({ id, data }: { id: ID; data: Vendedor }) =>
    updateById(TABLE_VENDEDORES, id, data),
} as Resolvers<Vendedor>;
