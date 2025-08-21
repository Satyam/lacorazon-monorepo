juris.registerHeadlessComponent(
  'DataFetch',
  (props, { getState, setState }) => ({
    api: {
      fetch: async (req, transformRequest, transformReply) => {
        const { service } = req;
        setState(`data.${service}.loading`, true);
        setState(`data.${service}.error`, null);
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
          .then((data) => {
            setState(`data.${service}.data`, data);
            setState(`data.${service}.lastFetch`, Date.now());
          })
          .catch((error) => {
            setState(`data.${service}.error`, error);
          })
          .finally(() => {
            setState(`data.${service}.loading`, false);
          });
      },

      getData: (service) => getState(`data.${service}.data`),
      isLoading: (service) => getState(`data.${service}.loading`, false),
      getError: (service) => getState(`data.${service}.error`),
      shouldRefetch: (service, maxAge = 300000) => {
        // 5 minutes
        const lastFetch = getState(`data.${service}.lastFetch`, 0);
        return Date.now() - lastFetch > maxAge;
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
