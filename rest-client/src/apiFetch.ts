export const apiFetch = async <Out>(
  serviceUrl: string,
  options?: RequestInit
) => {
  const resp = await fetch(`/api/${serviceUrl}`, options);
  const body = await resp.text();
  if (resp.ok) {
    return JSON.parse(body) as Out;
  }
  const err = new Error(resp.statusText);
  // @ts-ignore
  err.code = resp.status;
  // @ts-ignore
  err.msg = resp.statusText.replace('Error:', '').trim();
  throw err;
};

export const apiList = <Out>(
  service: string,
  options?: Record<string, string>
): Promise<Out> =>
  apiFetch(
    options
      ? `${service}?${new URLSearchParams(Object.entries(options))}`
      : service
  );

export const apiGet = <Out>(service: string, id: ID): Promise<Out> =>
  apiFetch(`${service}/${id}`);

export const apiCreate = <Out>(
  service: string,
  row: Partial<Out>
): Promise<Out> =>
  apiFetch(service, {
    method: 'POST',
    body: JSON.stringify(row),
    headers: { 'Content-Type': 'application/json' },
  });

export const apiUpdate = <Out>(
  service: string,
  id: ID,
  row: Partial<Out>
): Promise<Out> =>
  apiFetch(`${service}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(row),
    headers: { 'Content-Type': 'application/json' },
  });

export const apiDelete = (service: string, id: ID): Promise<undefined> =>
  apiFetch(`${service}/${id}`, {
    method: 'DELETE',
  });

export default apiFetch;
