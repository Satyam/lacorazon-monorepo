import { Request, Response, NextFunction } from 'express';

export type ApiReply<Data> = Promise<
  { data: Data } | { error: number; data: string }
>;

type Options = Record<string, number | string | boolean>;

export type RequestParams<Id = number | string, In = void, Ops = Options> = {
  id: Id;
  data: In;
  options?: Ops;
};

export type ApiRequest<Id = number | string, In = void, Ops = Options> = {
  service: string;
  op: string;
} & RequestParams<Id, In, Ops>;

export type CurrentUser = { id: string; name: string };

export type Handler<
  Id = number | string,
  In = void,
  Out = null,
  Ops = Options
> = (
  params: RequestParams<Id, In, Ops>,
  currentUser: CurrentUser
) => Promise<Out | null>;
export type Handlers = Record<string, Handler>;

declare global {
  namespace Express {
    interface Response {
      reply<Data>(data: Promise<Data | undefined>): void;
    }
    interface Request {
      request: ApiRequest;
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
  (req: Request, res: Response) => {
    try {
      const body = JSON.parse(req.body) as ApiRequest;
      req.body = body;

      checkSession(req, res).then((user) => {
        if (user) req.currentUser = user;
        else {
          res.json({
            error: UNAUTHORIZED,
            data: 'Unauthorized',
          });
          return;
        }
      });
      const { service, op } = body;
      const handler = handlers[op];
      if (handler) {
        try {
          res.json(handler(body, req.currentUser));
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
