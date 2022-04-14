import jwt from 'jsonwebtoken';
import { Request, Response, RequestHandler } from 'express';
import { checkValidUser } from './user.js';

const UNAUTHORIZED = 401;

const checkSession = (req: Request): Promise<User> =>
  new Promise((resolve, reject) => {
    const token: string = req.cookies[process.env.SESSION_COOKIE];
    if (token) {
      jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) reject(UNAUTHORIZED);
        else if (typeof decoded === 'object') {
          const { iat, exp, ...user } = decoded;
          resolve(user as User);
        } else reject(UNAUTHORIZED);
      });
    } else reject(UNAUTHORIZED);
  });

const setSessionCookie = (res: Response, user: User) =>
  res.cookie(
    process.env.SESSION_COOKIE,
    jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: `${process.env.SESSION_DURATION}s`,
    }),
    {
      httpOnly: true,
      expires: new Date(
        Date.now() + Number(process.env.SESSION_DURATION) * 1000
      ),
    }
  );

export const authMiddleware: RequestHandler = (req, res, next) => {
  checkSession(req)
    .then((user) => {
      res.locals.user = user;
      next();
    })
    .catch((error) => {
      res.json({
        error,
        data: 'Unauthorized',
      });
    });
};

const resolvers: AuthResolvers = {
  login: ({ data }, _req, res) =>
    checkValidUser(data.email ?? '', data.password ?? '').then((user) => {
      if (user) {
        setSessionCookie(res, user);
        return { data: user };
      }
      return {
        error: UNAUTHORIZED,
        data: 'null',
      };
    }),
  logout: (_1, _req, res) => {
    res.clearCookie(process.env.SESSION_COOKIE);
    return Promise.resolve({ data: null });
  },
  isLoggedIn: (_1, req, res) =>
    checkSession(req)
      .then((user) => {
        setSessionCookie(res, user);
        return { data: user };
      })
      .catch((_error) => {
        return {
          error: UNAUTHORIZED,
          data: 'null',
        };
      }),
};

export default resolvers;
