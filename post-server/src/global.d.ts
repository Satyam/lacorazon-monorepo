/// <reference path="@lacorazon/types/global.d.ts" />
import type { Request, Response } from 'express';

declare global {
  declare namespace NodeJS {
    interface ProcessEnv {
      SESSION_COOKIE: string;
      JWT_SECRET: string;
      SESSION_DURATION: string;
      DATABASE_PASSWORD: string;
      [key: string]: string | undefined;
    }
  }

  type ApiReply<T> = Promise<{ data: T } | { error: number; data: string }>;

  type ApiRequest<
    Id,
    Data,
    Opts = Record<string, number | string | boolean>
  > = {
    service: string;
    op: string;
    id: Id;
    data: Data;
    options?: Opts;
  };

  type Resolvers<Data, Opts = unknown> = {
    list: (
      apiReq: ApiRequest<undefined, undefined, Opts>,
      req: Request,
      res: Response
    ) => ApiReply<Data[]>;
    remove: (
      apiReq: ApiRequest<ID, undefined, Opts>,
      req: Request,
      res: Response
    ) => ApiReply<null>;
    get: (
      apiReq: ApiRequest<ID, undefined, Opts>,
      req: Request,
      res: Response
    ) => ApiReply<Data>;
    create: (
      apiReq: ApiRequest<ID, Data, Opts>,
      req: Request,
      res: Response
    ) => ApiReply<Data>;
    update: (
      apiReq: ApiRequest<ID, Data, Opts>,
      req: Request,
      res: Response
    ) => ApiReply<Data>;
  };

  type AuthResolvers = {
    login: (
      apiReq: ApiRequest<undefined, User>,
      req: Request,
      res: Response
    ) => ApiReply<User>;
    logout: (
      apiReq: ApiRequest<undefined, undefined>,
      req: Request,
      res: Response
    ) => ApiReply<null>;
    isLoggedIn: (
      apiReq: ApiRequest<undefined, undefined>,
      req: Request,
      res: Response
    ) => ApiReply<User>;
  };
}
