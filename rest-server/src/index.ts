/// <reference path="../../types/global.d.ts" />
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import dotEnv from 'dotenv';
import { initDb } from './utils.js';

import {
  listVentas,
  getVenta,
  createVenta,
  updateVenta,
  deleteVenta,
} from './ventas.js';

const app = express();
const port = 3000;

dotEnv.config();

const db = await initDb(process.env.DATABASE);

app.use(cookieParser());

const router = express.Router();
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

router.use('/ventas', ventas);

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
