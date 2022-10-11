#!/usr/bin/env zx
import dotEnv from 'dotenv';
import { report } from './testUtils.mjs';
import users from './users.mjs';
import vendedores from './vendedores.mjs';
import ventas from './ventas.mjs';
import auth from './auth.mjs';
dotEnv.config();

// the following have to do with different leves of debugging
process.env.NODE_ENV = 'test';
// process.env.DEBUG = 'express:*';
$.verbose = false;

// Monkey patch fetch:
let sessionId = null;
const addSession = (options) => {
  if (sessionId) {
    if (options) {
      options.headers = {
        ...options.headers,
        Cookie: `connect.sid=${sessionId}`,
      };
    } else {
      options = {
        headers: {
          Cookie: `connect.sid=${sessionId}`,
        },
      };
    }
  }
  return options;
};
const oldFetch = global.fetch;
global.fetch = (url, options) =>
  oldFetch(`http://localhost:3000${url}`, addSession(options)).then((resp) => {
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

    return resp;
  });
// ---

try {
  await $`fuser -k 3000/tcp`;
  console.log('previous server stopped');
} catch (err) {
  console.log('no server was running');
}
$.cwd = '../rest-server';
const server = $`node ../rest-server/dist/index.js`;

console.log();

await sleep(1000);
await vendedores();
await ventas();
await users();
await auth();
report();
console.log('Ignore the following error!');
server.kill();
await server;
