export enum ERRORS {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  NOT_ACCEPTABLE = 406,
  CONFLICT = 409,
  GONE = 410,
  RANGE_NOT_SATISFIABLE = 416,
}

export class ServerError extends Error {
  constructor(code: ERRORS, message: string) {
    super(message);
    this.code = code;
  }
  code: ERRORS;
}
export default ServerError;
