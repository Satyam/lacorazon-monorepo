const K_LOADING = 'fetch.loading';
const K_DETAILS = 'fetch.details';

juris.registerHeadlessComponent(
  'DataFetch',
  (props, { getState, setState }) => ({
    api: {
      fetch: async (req, transformRequest, transformReply) => {
        const { service, op } = req;
        const details = `At: ${Date.now()}, ${service}:${op}`;
        setState(K_LOADING, getState(K_LOADING) + 1);
        setState(K_DETAILS, [...getState(K_DETAILS, details)]);
        const body =
          transformRequest && 'data' in req
            ? requestTransform(req, transformRequest)
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
            return Promise.reject({
              error: resp.status,
              data: resp.statusText,
            });
          })
          .then((resp) => {
            if (resp.error) return Promise.reject(resp);
          })
          .then((response) => {
            const { data, error } = response;
            if (error) return Promise.reject(response);
            if (transformReply) {
              if (!data) return data;
              if (Array.isArray(data)) {
                return replyTransform(data, transformReply);
              }
              return replyTransform(data, transformReply);
            }
          })
          .finally(() => {
            setState(K_LOADING, Math.max(getState(K_LOADING) - 1, 0));
            setState(
              K_DETAILS,
              getState(K_DETAILS).filter((f) => f != details)
            );
          });
      },
    },
  }),
  { autoInit: true }
);

const requestTransform = (req, reqTransf) => {
  const t = (row) => {
    if (typeof row === 'undefined' || row === null) return undefined;

    const reqOut = Object.assign({}, row);
    for (const key in reqTransf) {
      reqOut[key] = reqTransf[key]?.(row[key], key, row) ?? row[key];
    }
    return reqOut;
  };
  if (reqTransf) {
    const data = req.data;

    return {
      ...req,
      data: Array.isArray(data) ? data.map((row) => t(row)) : t(data),
    };
  }
  return req;
};

function replyTransform(data, resTransf) {
  const t = (row) => {
    const resOut = Object.assign({}, row);
    for (const key in resTransf) {
      resOut[key] = resTransf[key]?.(row[key], key, row) ?? row[key];
    }
    return resOut;
  };
  if (Array.isArray(data)) return data.map((row) => t(row));
  return t(data);
}
