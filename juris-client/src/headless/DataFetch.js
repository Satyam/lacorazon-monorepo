import juris from '@src/jurisInstance.js';
import '@components/Loading.js';

juris.registerHeadlessComponent(
  'DataFetch',
  (props, { LoadingMgr }) => ({
    api: {
      fetch: async (req, transformRequest, transformReply) => {
        const { service, op } = req;
        const details = `At: ${Date.now()}, ${service}:${op}`;
        LoadingMgr.open(details);
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
            const { data, error } = resp;
            if (error) return Promise.reject(resp);
            if (transformReply) {
              if (!data) return data;
              if (Array.isArray(data)) {
                return replyTransform(data, transformReply);
              }
              return replyTransform(data, transformReply);
            }
            return data;
          })
          .finally(() => {
            LoadingMgr.close(details);
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
