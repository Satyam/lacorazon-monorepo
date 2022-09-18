/// <reference path="../../types/global.d.ts" />
import express, { Request, Response } from 'express';
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

const app = express();
const port = 3000;

dotEnv.config();

const db = await initDb(process.env.DATABASE);

app.use(cookieParser());

initAuth(app, db);

const auth = express.Router();

auth.get('/login', login);
auth.get('/logout', logout);
auth.get('/isLoggedIn', checkAuthenticated);

const ventas = express.Router();
ventas.get('/', async (_req: Request, res: Response) =>
  res.json(await listVentas(db))
);
ventas.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json(await getVenta(db, id));
});

ventas.post('/', async (req: Request, res: Response) => {
  res.json(await createVenta(db, req.body));
});

ventas.put('/:id', async (req: Request, res: Response) => {
  res.json(await updateVenta(db, req.params.id, req.body));
});

ventas.delete('/:id'),
  async (req: Request, res: Response) => {
    res.json(await deleteVenta(db, req.params.id));
  };

const vendedores = express.Router();
vendedores.get('/', async (_req: Request, res: Response) =>
  res.json(await listVendedores(db))
);
vendedores.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json(await getVendedor(db, id));
});

vendedores.post('/', async (req: Request, res: Response) => {
  res.json(await createVendedor(db, req.body));
});

vendedores.put('/:id', async (req: Request, res: Response) => {
  res.json(await updateVendedor(db, req.params.id, req.body));
});

vendedores.delete('/:id'),
  async (req: Request, res: Response) => {
    res.json(await deleteVendedor(db, req.params.id));
  };

const users = express.Router();

users.get('/', async (_req: Request, res: Response) =>
  res.json(await listUsers(db))
);
users.get('/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  res.json(await getUser(db, id));
});

users.post('/check', async (req: Request, res: Response) => {
  res.json(await checkValidUser(db, req.body));
});
users.post('/', async (req: Request, res: Response) => {
  res.json(await createUser(db, req.body));
});

users.put('/:id', async (req: Request, res: Response) => {
  res.json(await updateUser(db, req.params.id, req.body));
});

users.delete('/:id'),
  async (req: Request, res: Response) => {
    res.json(await deleteUser(db, req.params.id));
  };

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

app.listen(port, () => {
  console.log(`La Corazón app started at http://localhost:${port}`);
});

process.on('exit', () => {
  db.close().then(() => console.log('database closed'));
});
