#!/usr/bin/env zx
import dotEnv from 'dotenv';
import { report } from './testUtils.mjs';
import u from './users.mjs';
import v from './vendedores.mjs';
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
await v();
await u();
await auth();
report();
console.log('Ignore the following error!');
server.kill();
await server;
