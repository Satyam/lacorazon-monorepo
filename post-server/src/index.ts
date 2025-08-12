/// <reference path="../../types/global.d.ts" />
import express, { Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import auth, { authMiddleware } from './auth.js';
import vendedores from './vendedores.js';
import ventas from './ventas.js';
import users from './user.js';
import dotEnv from 'dotenv';

const app = express();
const port = 3000;

dotEnv.config();

app.use(cookieParser());

const INVALID_OP = 400;

type AllResolvers<T, O> = Resolvers<T, O> | AuthResolvers;
type ValidOps<T, O> = keyof Resolvers<T, O> | keyof AuthResolvers;
const postHandler =
  <T, O = undefined>(fns: AllResolvers<T, O>) =>
  (req: Request, res: Response) => {
    const apiReq = req.body as ApiRequest<ID | undefined, T | undefined, O>;
    const op: ValidOps<T, O> = apiReq.op as ValidOps<T, O>;
    // @ts-expect-error
    const fn = fns[op];
    // @ts-expect-error
    if (fn) fn(apiReq, req, res).then((resp) => res.json(resp));
    else
      res.status(INVALID_OP).json({
        error: INVALID_OP,
        data: `In "${req.path}", invalid op "${apiReq.op}" for service "${apiReq.service}"`,
      });
  };

app.post('/api/auth', express.json(), postHandler<User>(auth as AuthResolvers));
app.post(
  '/api/vendedores',
  express.json(),
  authMiddleware,
  postHandler<Vendedor>(vendedores)
);
app.post(
  '/api/ventas',
  express.json(),
  authMiddleware,
  postHandler<Venta, { idVendedor?: ID }>(ventas)
);
app.post(
  '/api/users',
  express.json(),
  authMiddleware,
  postHandler<User>(users)
);

app.use(express.static('../public'));

app.get('/{*splat}', (_, res) => {
  res.sendFile('index.html', { root: '../public' });
});

app.listen(port, () => {
  console.log(`La Corazón app started at http://localhost:${port}`);
});
