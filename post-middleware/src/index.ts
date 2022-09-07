import { Request, Response, NextFunction } from 'express';

type ID = string | number;
type VALUE = string | number | boolean | Date;
type AnyRow = Record<string, VALUE>;

export type ApiReply<Data> = Promise<
  { data: Data } | { error: number; data: string }
>;

type DefaultId = ID | undefined;
type DefaultIn = AnyRow | undefined;
type DefaultOut = AnyRow[] | (AnyRow | undefined);
type DefaultOpts = Options | undefined;
type Options = AnyRow;

export type RequestParams<
  Id extends DefaultId,
  In extends DefaultIn,
  Opts = DefaultOpts
> = {
  id: Id;
  data: In;
  options?: Opts;
};

export type ApiRequest<
  Id extends DefaultId = undefined,
  In extends DefaultIn = undefined,
  Opts extends DefaultOpts = undefined
> = {
  service: string;
  op: string;
} & RequestParams<Id, In, Opts>;

export type CurrentUser = { id: ID; nombre: string };

export type Handler<
  Id extends DefaultId,
  In extends DefaultIn,
  Out extends DefaultOut,
  Opts extends DefaultOpts = undefined
> = (
  params: RequestParams<Id, In, Opts>,
  currentUser: CurrentUser
) => Promise<Out>;

export type Handlers = Record<string, Handler<any, any, any, any>>;

declare global {
  namespace Express {
    interface Request {
      currentUser: CurrentUser;
    }
  }
}

export const INVALID_OP = 400;
export const UNAUTHORIZED = 401;
export const postMiddleware =
  (
    handlers: Handlers,
    checkSession: (
      req: Request,
      res: Response
    ) => Promise<CurrentUser | undefined>
  ) =>
  async (req: Request, res: Response) => {
    try {
      console.log({ handlers, body: req.body });
      const body = req.body as ApiRequest;
      console.log({ body });

      const user = await checkSession(req, res);
      if (user) req.currentUser = user;
      else {
        res.json({
          error: UNAUTHORIZED,
          data: 'Unauthorized',
        });
        return;
      }

      console.log({ user });
      const { service, op } = body;
      console.log({ service, op });
      const handler = handlers[op];
      if (handler) {
        try {
          const reply = await handler(body, req.currentUser);
          res.json(reply);
        } catch (err) {
          res.json({
            // @ts-ignore
            error: err.code ?? err.statusCode ?? err,
            data: err,
          });
        }
      } else {
        res.json({
          error: INVALID_OP,
          data: `Request for service: ${service} operation ${op} does not exist`,
        });
      }
    } catch (err) {
      console.log('catch json stringify', err);
      res.json({
        error: INVALID_OP,
        data: `Request: ${JSON.stringify(req.body, null, 2)} cannot be decoded`,
      });
    }
  };

export const errorMiddleware = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  res.json({ error: JSON.stringify(err), data: err });
};
