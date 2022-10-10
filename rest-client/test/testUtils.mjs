import { AssertionError, strict } from 'node:assert';

export const assert = strict;
export const describe = async (descr, fn) => {
  console.log(chalk.bold(descr));
  await fn();
};

let pass = 0;
let fail = 0;
let unknowns = 0;

export const test = async (descr, fn) => {
  console.log(chalk.cyan(descr));
  try {
    await fn();
    pass++;
  } catch (err) {
    if (err instanceof AssertionError) {
      fail++;
      console.log('-----------------------');
      console.log(chalk.red(descr));
      console.log(
        err
          .toString()
          .replace('AssertionError [ERR_ASSERTION]', chalk.yellow(err.operator))
      );
      console.log('actual');
      console.log(chalk.red(JSON.stringify(err.actual, null, 2)));
      console.log('expected');
      console.log(chalk.green(JSON.stringify(err.expected, null, 2)));
      console.log('-----------------------');
    } else {
      unknowns++;
      console.log(chalk.magenta(err));
    }
  }
};

let sessionId = null;

export const apiFetch = async (
  partialUrl,
  method = 'GET',
  body,
  returnResponse
) => {
  const options = {
    method,
    redirect: 'manual',
  };
  if (body) {
    options.body = JSON.stringify(body);
    options.headers = { 'Content-Type': 'application/json' };
  }
  if (sessionId) {
    options.headers = {
      ...options.headers,
      Cookie: `connect.sid=${sessionId}`,
    };
  }
  const resp = await fetch(
    `http://localhost:${process.env.PORT}/api/${partialUrl}`,
    options
  );
  try {
    const reply = await resp.text();
    const setCookie = resp.headers.raw()['set-cookie'];
    if (setCookie) {
      setCookie.forEach((cookie) => {
        cookie.split(';').forEach((part) => {
          const [key, value] = part.split('=');
          if (key === 'connect.sid') {
            sessionId = value;
          }
        });
      });
    }
    if ($.verbose) console.log({ reply });
    if (resp.ok) {
      try {
        const r = JSON.parse(reply);
        return returnResponse ? { ...r, _response: resp } : r;
      } catch (err) {
        err.msg = reply;
        if (returnResponse) err.response = resp;
        throw err;
      }
    }
    if (resp.status === 301 || resp.status === 302) {
      const location = resp.headers.get('location');
      const err = new Error(`redirect: ${location}`);
      err.code = resp.status;
      err.location = location;
      if (returnResponse) err.response = resp;
      throw err;
    }
  } catch (err) {
    if (returnResponse) err.response = resp;
    throw err;
  }
  const err = new Error(resp.statusText);
  err.code = resp.status;
  err.msg = resp.statusText.replace('Error:', '').trim();
  if (returnResponse) err.response = resp;
  throw err;
};

export const report = () =>
  console.log(`
--------------
pass:     ${pass}
fail:     ${fail}
unknowns: ${unknowns}
--------------


`);
