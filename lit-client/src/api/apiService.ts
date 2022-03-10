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

// function replyTransform<OUT extends AnyRow>(
//   data: AnyRow,
//   rpt: ReplyTransformer<OUT>
// ): OUT;
// function replyTransform<OUT extends AnyRow[]>(
//   data: AnyRow[],
//   rpt: ReplyTransformer<ArrayElementType<OUT>>
// ): OUT;
function replyTransform<OUT extends AnyRow>(
  data: AnyRow | AnyRow[],
  rpt: ReplyTransformer<OUT>
): OUT | OUT[] {
  const t = (row: AnyRow) => {
    const rep: AnyRow = Object.assign({}, row);
    for (const key in rpt) {
      rep[key] = rpt[key](row[key], key, row);
    }
    return rep as OUT;
  };
  if (Array.isArray(data)) return data.map((row) => t(row)) as unknown as OUT[];
  return t(data) as OUT;
}

// export function apiFetch<
//   IN extends AnyRow | undefined = undefined,
//   OUT extends null | undefined = undefined
// >(
//   operation: OPERATION<IN>,
//   transformRequest?: RequestTransformer<IN>,
//   transformReply?: ReplyTransformer<OUT>
// ): Promise<OUT>;

// export function apiFetch<
//   IN extends AnyRow | undefined = undefined,
//   OUT extends AnyRow = AnyRow
// >(
//   operation: OPERATION<IN>,
//   transformRequest?: RequestTransformer<IN>,
//   transformReply?: ReplyTransformer<OUT>
// ): Promise<OUT>;

// export function apiFetch<
//   IN extends AnyRow | undefined = undefined,
//   OUT extends AnyRow[] = AnyRow[]
// >(
//   operation: OPERATION<IN>,
//   transformRequest?: RequestTransformer<IN>,
//   transformReply?: ReplyTransformer<ArrayElementType<OUT>>
// ): Promise<OUT>;

export function apiFetch<
  IN extends AnyRow | undefined,
  OUT extends AnyRow = AnyRow
>(
  operation: OPERATION<IN>,
  transformRequest?: RequestTransformer<IN>,
  transformReply?: ReplyTransformer<OUT>
): Promise<OUT | OUT[] | null> {
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
          return replyTransform<OUT>(data as AnyRow[], transformReply) as OUT[];
        }
        return replyTransform<OUT>(data as AnyRow, transformReply);
      }
      return data;
    });
}

export class ApiService<IN extends AnyRow | undefined, OUT extends AnyRow> {
  host: ReactiveControllerHost;
  value?: OUT;
  private task!: Task;
  private _operation: OPERATION<IN>;

  constructor(
    host: ReactiveControllerHost,
    operation: OPERATION<IN>,
    transformRequest?: RequestTransformer<IN>,
    transformReply?: ReplyTransformer<OUT>
  ) {
    this.host = host;
    this._operation = operation;
    this.task = new Task(
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
