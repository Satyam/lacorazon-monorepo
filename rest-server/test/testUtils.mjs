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
  try {
    await fn();
    console.log(chalk.cyan(descr));
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
export const apiFetch = async (partialUrl, method = 'GET', body) => {
  const options = body
    ? {
        method,
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      }
    : { method };
  const resp = await fetch(
    `http://localhost:${process.env.PORT}/api/${partialUrl}`,
    options
  );
  if (resp.ok) {
    try {
      return await resp.json();
    } catch (err) {
      const error = new Error('Unable to decode response');
      error.body = await resp.text();
      throw error;
    }
  }
  const err = new Error(resp.statusText);
  err.code = resp.status;
  err.msg = resp.statusText.replace('Error:', '').trim();
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
