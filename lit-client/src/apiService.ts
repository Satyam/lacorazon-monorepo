import { ReactiveControllerHost } from 'lit';
import { StatusRenderer, Task } from '@lit-labs/task';

export class ApiService<
  IN extends Record<string, VALUE> = Record<string, VALUE>,
  OUT extends Record<string, VALUE> | Array<Record<string, VALUE>> = IN,
  OPT extends Record<string, VALUE> = Record<string, VALUE>,
  OPERATION = {
    op: string;
    id?: ID;
    data?: IN;
    options?: OPT;
  }
> {
  host: ReactiveControllerHost;
  value?: OUT;
  private task!: Task;
  private _service: string;
  private _operation: OPERATION;

  constructor(
    host: ReactiveControllerHost,
    service: string,
    operation: OPERATION
  ) {
    this.host = host;
    this._service = service;
    this._operation = operation;
    this.task = new Task(
      host,
      ([service, operation]: [string, OPERATION]) =>
        fetch(`${window.origin}/api/${service}`, {
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
          }),
      () => [this.service, this.operation] as [string, OPERATION]
    );
  }

  set service(service: string) {
    this._service = service;
    this.host.requestUpdate();
  }
  get service() {
    return this._service;
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
