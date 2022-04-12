import jwt, { VerifyErrors, JwtPayload } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { checkValidUser } from './user.js';

const UNAUTHORIZED = 401;

declare module 'express' {
  interface Request {
    user: User;
  }
}

const checkSession = (req: Request): Promise<User> =>
  new Promise((resolve, reject) => {
    const token = req.cookies[process.env.SESSION_COOKIE];
    if (token) {
      jwt.verify(
        token,
        process.env.JWT_SECRET,
        (err: VerifyErrors, { iat, exp, ...user }: JwtPayload) => {
          if (err) reject(UNAUTHORIZED);
          else {
            resolve(user as User);
          }
        }
      );
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

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  checkSession(req)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((error) => {
      res.json({
        error,
        data: 'Unauthorized',
      });
    });
};

export default {
  login: (
    { data }: { data: Required<Pick<User, 'email' | 'password'>> },
    _req: Request,
    res: Response
  ) =>
    checkValidUser(data.email, data.password).then((user) => {
      setSessionCookie(res, user);
      return { data: user };
    }),
  logout: (_1: void, _req: Request, res: Response) => {
    res.clearCookie(process.env.SESSION_COOKIE);
    return Promise.resolve({ data: {} });
  },
  isLoggedIn: (_1: void, req: Request, res: Response) =>
    checkSession(req)
      .then((user) => {
        setSessionCookie(res, user);
        return { data: user };
      })
      .catch((_error) => {
        return {
          data: null,
        };
      }),
};
