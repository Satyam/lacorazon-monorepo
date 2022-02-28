import { ReactiveControllerHost } from 'lit';
import { StatusRenderer, Task } from '@lit-labs/task';

type OPERATION<IN, OPT> = {
  service: string;
  op: string;
  id?: ID;
  data?: IN;
  options?: OPT;
};
export const apiFetch = <
  IN extends Record<string, VALUE> = Record<string, VALUE>,
  OUT extends Record<string, VALUE> | Array<Record<string, VALUE>> | null = IN,
  OPT extends Record<string, VALUE> = Record<string, VALUE>
>(
  operation: OPERATION<IN, OPT>
): Promise<OUT> =>
  fetch(`${window.origin}/api/${operation.service}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(operation),
  })
    .then((resp) => {
      if (resp && resp.ok) return resp.json();
      return Promise.reject(resp.statusText);
    })
    .then((resp) => {
      if (resp.error) return Promise.reject(resp.data);
      return resp.data;
    });

export class ApiService<
  IN extends Record<string, VALUE> = Record<string, VALUE>,
  OUT extends Record<string, VALUE> | Array<Record<string, VALUE>> = IN,
  OPT extends Record<string, VALUE> = Record<string, VALUE>
> {
  host: ReactiveControllerHost;
  value?: OUT;
  private task!: Task;
  private _operation: OPERATION<IN, OPT>;

  constructor(host: ReactiveControllerHost, operation: OPERATION<IN, OPT>) {
    this.host = host;
    this._operation = operation;
    this.task = new Task(
      host,
      ([operation]: [OPERATION<IN, OPT>]) => apiFetch<IN, OUT, OPT>(operation),
      () => [this.operation] as [OPERATION<IN, OPT>]
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
