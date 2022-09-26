#!/usr/bin/env zx
import dotEnv from 'dotenv';
import { report } from './testUtils.mjs';
import v from './vendedores.mjs';
dotEnv.config();
process.env.NODE_ENV = 'test';

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
report();
server.kill();
await server;