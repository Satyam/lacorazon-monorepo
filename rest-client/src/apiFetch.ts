export const apiFetch = <Out>(serviceUrl: string, options?: RequestInit) =>
  fetch(`/api/${serviceUrl}`, options)
    .then((response) => response.json())
    .then((data) => data as Out);

export const apiList = <Out>(service: string, idVendedor?: ID): Promise<Out> =>
  fetch(`/api/${service}`, {
    body: { idVendedor } as unknown as BodyInit,
  })
    .then((response) => response.json())
    .then((data) => data as Out);

export const apiGet = <Out>(service: string, id: ID): Promise<Out> =>
  fetch(`/api/${service}/${id}`)
    .then((response) => response.json())
    .then((data) => data as Out);

export const apiCreate = <Out>(
  service: string,
  row: Partial<Out>
): Promise<Out> =>
  fetch(`/api/${service}`, {
    method: 'POST',
    body: row as unknown as BodyInit,
  })
    .then((response) => response.json())
    .then((data) => data as Out);

export const apiUpdate = <Out>(
  service: string,
  id: ID,
  row: Partial<Out>
): Promise<Out> =>
  fetch(`/api/${service}/${id}`, {
    method: 'PUT',
    body: row as unknown as BodyInit,
  })
    .then((response) => response.json())
    .then((data) => data as Out);

export const apiDelete = (service: string, id: ID): Promise<undefined> =>
  fetch(`/api/${service}/${id}`, {
    method: 'DELETE',
  }).then(() => undefined);

export default apiFetch;
