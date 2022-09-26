/// <reference path="../../types/global.d.ts" />
import express, { NextFunction, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import dotEnv from 'dotenv';

import { initDb } from './utils.js';
import { login, logout, initAuth, checkAuthenticated } from './auth.js';
import {
  listVentas,
  getVenta,
  createVenta,
  updateVenta,
  deleteVenta,
} from './ventas.js';
import {
  listVendedores,
  getVendedor,
  createVendedor,
  updateVendedor,
  deleteVendedor,
} from './vendedores.js';

import {
  checkValidUser,
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from './users.js';
import ServerError from './serverError.js';

const app = express();

dotEnv.config();

const db = await initDb(process.env.DATABASE);
const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

if (!db) {
  console.error('No database filename in .env file');
  process.exit(1);
}

app.use(cookieParser());

initAuth(app, db);

const auth = express.Router();

auth.get('/login', login);
auth.get('/logout', logout);
auth.get('/isLoggedIn', checkAuthenticated);

const ventas = express.Router();

ventas.get('/', async (req: Request, res: Response) =>
  res.json(await listVentas(db, req.query.idVendedor as ID))
);
ventas.get('/:id', async (req: Request, res: Response) =>
  res.json(await getVenta(db, req.params.id))
);

ventas.post('/', async (req: Request, res: Response) =>
  res.json(await createVenta(db, req.body))
);

ventas.put('/:id', async (req: Request, res: Response) =>
  res.json(await updateVenta(db, req.params.id, req.body))
);

ventas.delete('/:id', async (req: Request, res: Response) =>
  res.json(await deleteVenta(db, req.params.id))
);

const vendedores = express.Router();

vendedores.get('/', async (_req: Request, res: Response) =>
  res.json(await listVendedores(db))
);

vendedores.get('/:id', async (req: Request, res: Response) =>
  res.json(await getVendedor(db, req.params.id))
);

vendedores.post('/', async (req: Request, res: Response) =>
  res.json(await createVendedor(db, req.body))
);

vendedores.put('/:id', async (req: Request, res: Response) =>
  res.json(await updateVendedor(db, req.params.id, req.body))
);

vendedores.delete('/:id', async (req: Request, res: Response) =>
  res.json(await deleteVendedor(db, req.params.id))
);

const users = express.Router();

users.get('/', async (_req: Request, res: Response) =>
  res.json(await listUsers(db))
);

users.get('/:id', async (req: Request, res: Response) =>
  res.json(await getUser(db, req.params.id))
);

users.post('/check', async (req: Request, res: Response) =>
  res.json(await checkValidUser(db, req.body))
);

users.post('/', async (req: Request, res: Response) =>
  res.json(await createUser(db, req.body))
);

users.put('/:id', async (req: Request, res: Response) =>
  res.json(await updateUser(db, req.params.id, req.body))
);

users.delete('/:id', async (req: Request, res: Response) =>
  res.json(await deleteUser(db, req.params.id))
);

const router = express.Router();
router.use('/auth', auth);
router.use('/ventas', ventas);
router.use('/vendedores', vendedores);
router.use('/users', users);

app.use('/api', express.json(), router);

db.on('trace', (data: any) => {
  console.log(data);
});
app.use(express.static('../public'));

app.get('*', (_, res) => {
  res.sendFile('index.html', { root: '../public' });
});
app.use((err: Error, _req: Request, res: Response, next: NextFunction) => {
  console.log(err);
  if (err instanceof ServerError) {
    res.statusCode = err.code;
    res.statusMessage = err.toString();
    res.end();
    // res.status(err.code).send(err.toString());
  } else next(err);
});

app.listen(port, () => {
  console.log(`La Corazón app started at http://localhost:${port}`);
});

process.on('exit', () => {
  db.close().then(() => console.log('database closed'));
});
