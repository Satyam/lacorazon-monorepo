import { ReactiveControllerHost } from 'lit';
import { StatusRenderer, Task } from '@lit-labs/task';

const requestTransform = <IN>(
  op: OPERATION<IN | IN[]>,
  rqt: RequestTransformer<IN>
) => {
  const data = op.data;
  const t = (row: IN) => {
    if (typeof row === 'undefined') return undefined;
    const req: AnyRow = Object.assign({}, row);
    for (const key in rqt) {
      req[key] = rqt[key](row[key], key, row);
    }
    return req;
  };

  if (data && rqt) {
    return {
      ...op,
      data: Array.isArray(data) ? data.map((row) => t(row)) : t(data),
    };
  }
  return op;
};

function replyTransform(
  data: AnyRow | AnyRow[],
  rpt: ReplyTransformer
): unknown {
  const t = (row: AnyRow) => {
    const rep: AnyRow = Object.assign({}, row);
    for (const key in rpt) {
      rep[key] = rpt[key](row[key], key, row);
    }
    return rep;
  };
  if (Array.isArray(data)) return data.map((row) => t(row));
  return t(data);
}

export function apiFetch<IN extends AnyRow | undefined, OUT>(
  operation: OPERATION<IN>,
  transformRequest?: RequestTransformer<IN>,
  transformReply?: ReplyTransformer
): Promise<OUT> {
  return fetch(`${window.origin}/api/${operation.service}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(
      transformRequest
        ? requestTransform<IN>(operation, transformRequest)
        : operation
    ),
  })
    .then((resp) => {
      if (resp && resp.ok) return resp.json();
      return Promise.reject(resp.statusText);
    })
    .then((resp) => {
      const { data, error } = resp;
      if (error) return Promise.reject(resp.data);
      if (transformReply) {
        if (!data) return data as null;

        if (Array.isArray(data)) {
          return replyTransform(data as AnyRow[], transformReply) as OUT[];
        }
        return replyTransform(data as AnyRow, transformReply);
      }
      return data;
    });
}

export class ApiService<IN extends AnyRow | undefined, OUT> {
  host: ReactiveControllerHost;
  value?: OUT;
  private task!: Task;
  private _operation: OPERATION<IN>;

  constructor(
    host: ReactiveControllerHost,
    operation: OPERATION<IN>,
    transformRequest?: RequestTransformer<IN>,
    transformReply?: ReplyTransformer
  ) {
    this.host = host;
    this._operation = operation;
    this.task = new Task<[OPERATION<IN>], OUT>(
      host,
      ([operation]: [OPERATION<IN>]) =>
        apiFetch<IN, OUT>(operation, transformRequest, transformReply),
      () => [this.operation] as [OPERATION<IN>]
    );
  }

  set operation(operation) {
    this._operation = operation;
    this.host.requestUpdate();
  }
  get operation() {
    return this._operation;
  }

  render(renderFunctions: StatusRenderer<OUT>) {
    return this.task.render(renderFunctions);
  }
}
