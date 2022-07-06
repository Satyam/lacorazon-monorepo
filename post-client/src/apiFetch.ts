const requestTransform = <Id, IN>(
  req: ApiRequest<Id, IN>,
  reqTransf: RequestTransformer<IN>
) => {
  const t = (row: IN) => {
    if (typeof row === 'undefined') return undefined;
    const reqOut: AnyRow = Object.assign({}, row);
    for (const key in reqTransf) {
      reqOut[key] = reqTransf[key](row[key], key, row);
    }
    return reqOut;
  };
  if (reqTransf) {
    const data = (req as unknown as { data: IN }).data!;

    return {
      ...req,
      data: Array.isArray(data) ? data.map((row) => t(row)) : t(data),
    };
  }
  return req;
};

function replyTransform<OUT>(
  data: AnyRow | AnyRow[],
  resTransf: ReplyTransformer<OUT>
): unknown {
  const t = (row: AnyRow) => {
    const resOut = Object.assign({}, row) as ArrayElementType<OUT>;
    for (const key in resTransf) {
      resOut[key] = resTransf[key](row[key], key, row);
    }
    return resOut;
  };
  if (Array.isArray(data)) return data.map((row) => t(row));
  return t(data);
}

export function apiFetch<Id, IN extends undefined, OUT>(
  req: ApiRequest<undefined, IN>,
  transformRequest: undefined,
  transformReply?: ReplyTransformer<OUT>
): Promise<OUT>;
export function apiFetch<Id, IN, OUT>(
  req: ApiRequest<Id, IN>,
  transformRequest?: RequestTransformer<IN>,
  transformReply?: ReplyTransformer<OUT>
): Promise<OUT>;
export function apiFetch<Id, IN extends AnyRow | undefined, OUT>(
  req: ApiRequest<Id, IN>,
  transformRequest: RequestTransformer<IN> | undefined,
  transformReply?: ReplyTransformer<OUT>
): Promise<OUT> {
  const body =
    transformRequest && 'data' in req
      ? requestTransform<Id, IN>(req, transformRequest)
      : req;

  return fetch(`${window.origin}/api/${req.service}`, {
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset=utf-8',
    },
    body: JSON.stringify(body),
  })
    .then((resp) => {
      if (resp && resp.ok) return resp.json();
      return Promise.reject(resp.statusText);
    })
    .then((resp) => {
      const { data, error } = resp;
      if (error) return Promise.reject(resp);
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

export default apiFetch;
