import { Express, NextFunction, Request, Response } from 'express';
import { Database } from 'sqlite';
import passport from 'passport';
import session from 'express-session';
import {
  Strategy as LocalStrategy,
  VerifyFunction,
  IVerifyOptions,
} from 'passport-local';
import { createHmac } from 'crypto';
import { TABLE_USERS } from './utils.js';

declare global {
  namespace Express {
    // tslint:disable-next-line:no-empty-interface
    interface AuthInfo {}
    // tslint:disable-next-line:no-empty-interface
    interface User {
      id: ID;
      nombre: string;
      email: string;
    }
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

const verify =
  (db: Database): VerifyFunction =>
  (
    email: string,
    password: string,
    done: (error: any, user?: any, options?: IVerifyOptions) => void
  ) => {
    db.get(
      `select id, nombre, email
     from ${TABLE_USERS} where lower(email) = lower(?) and password = ?`,
      [email, hashPassword(password)]
    ).then(
      (user) => done(null, user ?? false),
      (err) => done(err, false)
    );
  };
export const initAuth = (app: Express, db: Database) => {
  app.use(
    session({
      secret: process.env.JWT_SECRET ?? 'alguna cosa',
      resave: false,
      saveUninitialized: true,
    })
  );

  // This is the basic express session({..}) initialization.
  app.use(passport.initialize());
  // init passport on every route call.
  app.use(passport.session());
  // allow passport to use "express-session".

  passport.use(
    new LocalStrategy(
      { usernameField: 'email', passwordField: 'password' },
      verify(db)
    )
  );

  passport.serializeUser<string>((user, done) => {
    try {
      done(null, JSON.stringify(user));
    } catch (error) {
      done(error);
    }
  });

  passport.deserializeUser<string>((userString, done) => {
    try {
      done(null, JSON.parse(userString));
    } catch (err) {
      done(err);
    }
  });
};

export const login = () => {
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/login',
  });
};
export const logout = (req: Request, res: Response, next: NextFunction) =>
  req.logOut((err) => {
    if (err) {
      return next(err);
    }
    res.redirect('/login');
  });

export const checkAuthenticated = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};
