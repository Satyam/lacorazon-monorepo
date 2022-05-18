import { MongoClient, Db, Document } from 'mongodb';
import cuid from 'cuid';

export const TABLE_VENTAS = 'Ventas';
export const TABLE_VENDEDORES = 'Vendedores';
export const TABLE_DISTRIBUIDORES = 'Distribuidores';
export const TABLE_SALIDAS = 'Salidas';
export const TABLE_USERS = 'Users';
export const TABLE_CONSIGNA = 'Consigna';

const monitorCommands = false;

export const mongo = new MongoClient(
  process.env.MONGO_URL || 'mongodb://localhost:27017',
  { monitorCommands }
);
if (monitorCommands) {
  ['commandStarted', 'commandSucceeded', 'commandFailed'].forEach((eventName) =>
    mongo.on(eventName, (event) => {
      console.log(`received ${eventName}: ${JSON.stringify(event, null, 2)}`);
    })
  );
}
let _db: Db;

export function mongoInit() {
  return mongo.connect().then(() => {
    _db = mongo.db(process.env.MONGO_DB || 'lacorazon');
  });
}

export function getColl<T>(name: string) {
  return _db.collection<T>(name);
}

export function formatReply<T>(q: Promise<T | null>): ApiReply<T> {
  return q
    .then((data) => (data ? { data } : Promise.reject('not found')))
    .catch((err) => ({
      error: err.code,
      data: err.message,
    }));
}

export const defaultProjection: Document[] = [
  {
    $addFields: { id: '$_id' },
  },
  {
    $project: { _id: false, password: false },
  },
];

export function listAll<T>(nombreTabla: string) {
  return formatReply<T[]>(
    getColl(nombreTabla).aggregate<T>(defaultProjection).toArray()
  );
}

export function rawGetById<T>(nombreTabla: string, id: ID): Promise<T | null> {
  return getColl(nombreTabla)
    .aggregate<T>([{ $match: { _id: id } }, ...defaultProjection])
    .toArray()
    .then((rows) => rows[0]);
}

export function getById<T>(nombreTabla: string, id: ID): ApiReply<T> {
  return formatReply<T>(rawGetById<T>(nombreTabla, id));
}

export function createWithAutoId<T>(
  nombreTabla: string,
  fila: Partial<T & { id?: ID }>
): ApiReply<T> {
  const { id, ...rest } = fila;
  const _id: ID = id ?? cuid();

  return formatReply<T>(
    getColl<T & { _id: ID }>(nombreTabla)
      // @ts-ignore
      .insertOne({ _id, ...rest })
      .then(() => rawGetById<T>(nombreTabla, _id))
  );
}

export function updateById<T>(
  nombreTabla: string,
  id: ID,
  fila: T
): ApiReply<T> {
  return formatReply<T>(
    getColl(nombreTabla)
      .updateOne({ _id: id }, { $set: fila })
      .then(() => rawGetById(nombreTabla, id))
  );
}

export function deleteById(nombreTabla: string, id: ID): ApiReply<null> {
  return getColl(nombreTabla)
    .deleteOne({ _id: id })
    .then(() => ({ data: null }))
    .catch((err) => ({
      error: err.code,
      data: err.message,
    }));
}
