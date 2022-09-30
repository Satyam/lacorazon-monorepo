import { NextFunction, Request, Response } from 'express';
import { Database } from 'sqlite';

import { createHmac } from 'crypto';
import { TABLE_USERS } from './utils.js';
import { ERRORS, ServerError } from './serverError.js';
declare module 'express-session' {
  interface SessionData {
    user: User;
  }
}

export function hashPassword(password?: string) {
  if (!password) return password;
  const hmac = createHmac(
    'sha256',
    process.env.DATABASE_PASSWORD || 'alguna tontera'
  );
  hmac.update(password.toLowerCase());
  return hmac.digest('hex');
}

export const login = (db: Database) => async (req: Request, res: Response) => {
  req.session.user = undefined;
  const { email, password } = req.body;
  await db
    .get(
      `select id, nombre, email
   from ${TABLE_USERS} where lower(email) = lower(?) and password = ?`,
      [email, hashPassword(password)]
    )
    .then((user) => {
      if (user) {
        req.session.user = user;
        res.json(user);
      } else
        throw new ServerError(ERRORS.UNAUTHORIZED, 'email or password failed');
    });
};

export const logout = async (req: Request, res: Response) =>
  req.session.destroy((err) => {
    if (err) throw err;
    res.json({});
  });

export const currentUser = (req: Request, res: Response) => {
  res.json(req.session.user || {});
};

export const authorized = async (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  if (req.session.user) next();
  else throw new ServerError(ERRORS.UNAUTHORIZED, 'Not authorized');
};
