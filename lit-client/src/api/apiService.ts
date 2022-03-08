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

const replyTransform = <OUT extends AnyRow>(
  data: OUT | OUT[],
  rpt: ReplyTransformer<OUT>
) => {
  const t = (row: AnyRow) => {
    const rep: AnyRow = Object.assign({}, row);
    for (const key in rpt) {
      rep[key] = rpt[key](row[key], key, row);
    }
    return rep as OUT;
  };
  if (data && rpt) {
    return Array.isArray(data) ? data.map((row) => t(row)) : t(data);
  }
  return {};
};

export const apiFetch = <
  IN extends AnyRow | undefined = AnyRow,
  OUT extends AnyRow | AnyRow[] | null | undefined = IN
>(
  operation: OPERATION<IN>,
  transformRequest?: RequestTransformer<IN>,
  transformReply?: ReplyTransformer<OUT>
): Promise<OUT> =>
  fetch(`${window.origin}/api/${operation.service}`, {
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
      if (resp.error) return Promise.reject(resp.data);
      return transformReply
        ? replyTransform(resp.data, transformReply)
        : resp.data;
    });

export class ApiService<
  IN extends AnyRow | undefined = AnyRow,
  OUT extends AnyRow | AnyRow[] | undefined = IN
> {
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
