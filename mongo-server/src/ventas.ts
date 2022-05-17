import {
  TABLE_VENTAS,
  getColl,
  createWithAutoId,
  updateById,
  deleteById,
  formatReply,
  defaultProjection,
} from './utils.js';

const ventasYVendedor = [
  {
    $lookup: {
      from: 'Vendedores',
      localField: 'idVendedor',
      foreignField: '_id',
      as: 'arrVendedor',
    },
  },
  // {
  //   $replaceRoot: {
  //     newRoot: {
  //       $mergeObjects: [
  //         {
  //           $arrayElemAt: ['$arrVendedor', 0],
  //         },
  //         '$$ROOT',
  //       ],
  //     },
  //   },
  // },
  {
    $addFields: {
      vendedor: {
        $getField: {
          field: 'nombre',
          input: { $arrayElemAt: ['$arrVendedor', 0] },
        },
      },
    },
  },
  {
    $project: {
      email: false,
      arrVendedor: false,
    },
  },
  ...defaultProjection,
];

const resolvers: Resolvers<Venta, { idVendedor?: ID }> = {
  list: ({ options }) =>
    formatReply<Venta[]>(
      options?.idVendedor
        ? getColl(TABLE_VENTAS)
            .aggregate<Venta>([
              { $match: { idVendedor: options.idVendedor } },
              ...defaultProjection,
            ])
            .toArray()
        : getColl(TABLE_VENTAS)
            .aggregate<VentaYVendedor>(ventasYVendedor)
            .toArray()
    ),
  remove: ({ id }) => deleteById(TABLE_VENTAS, id),
  get: ({ id }) =>
    formatReply(
      getColl(TABLE_VENTAS)
        .aggregate<VentaYVendedor>([
          { $match: { _id: id } },
          { $limit: 1 },
          ...ventasYVendedor,
        ])
        .toArray()
        .then((arr) => arr[0])
    ),
  create: ({ data }) => createWithAutoId(TABLE_VENTAS, data),
  update: ({ id, data }) => updateById(TABLE_VENTAS, id, data),
};

export default resolvers;
