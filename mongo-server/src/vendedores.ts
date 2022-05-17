import {
  TABLE_VENDEDORES,
  listAll,
  getById,
  createWithAutoId,
  updateById,
  deleteById,
} from './utils.js';

const resolvers: Resolvers<Vendedor> = {
  list: () => listAll(TABLE_VENDEDORES),
  remove: ({ id }) => deleteById(TABLE_VENDEDORES, id),
  get: ({ id }) => getById(TABLE_VENDEDORES, id),
  create: ({ data }) => createWithAutoId(TABLE_VENDEDORES, data),
  update: ({ id, data }) => updateById(TABLE_VENDEDORES, id, data),
};

export default resolvers;
