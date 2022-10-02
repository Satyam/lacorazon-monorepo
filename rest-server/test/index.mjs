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

try {
  await $`fuser -k 3000/tcp`;
  console.log('previous server stopped');
} catch (err) {
  console.log('no server was running');
}

const server = $`node ./dist/index.js`;

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
