#!/usr/bin/env zx
import { AssertionError, strict as assert } from 'node:assert';
import dotEnv from 'dotenv';

dotEnv.config();
process.env.NODE_ENV = 'test';

$.verbose = false;
const port = process.env.PORT;
const vendedores = [
  {
    nombre: 'pepe',
    email: 'pepe@correo.com',
  },
  {
    nombre: 'cacho',
    email: 'cacho@correo.com',
  },
];

const ventas = [
  {
    concepto: 'prueba',
    fecha: '2022-03-11T16:40:00.112Z',
    cantidad: 1,
    precioUnitario: 12,
    iva: 0,
  },
  {
    concepto: 'prueba 2',
    fecha: '2022-03-11T16:42:45.557Z',
    cantidad: 1,
    precioUnitario: 12,
    iva: 1,
  },
  {
    concepto: 'prueba3',
    fecha: '2022-03-11T16:48:31.782Z',
    cantidad: 2,
    precioUnitario: 12,
  },
  {
    concepto: 'qqq',
    fecha: '2022-07-04T16:20:35.277Z',
    cantidad: 1,
    precioUnitario: 10,
  },
];

const users = [
  { nombre: 'Pepe', email: 'pepe@correo.com' },
  { nombre: 'cacho', email: 'cacho@correo.com' },
];

const describe = async (descr, fn) => {
  console.log(chalk.bold(descr));
  await fn();
};
let pass = 0;
let fail = 0;
let unknowns = 0;
const test = async (descr, fn) => {
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

const apiFetch = async (partialUrl, method = 'GET', body) => {
  const options = body
    ? {
        method,
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      }
    : { method };
  const resp = await fetch(
    `http://localhost:${port}/api/${partialUrl}`,
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

try {
  await $`fuser -k 3000/tcp`;
  console.log('previous server stopped');
} catch (err) {
  console.log('no server was running');
}

const server = $`node ./dist/index.js`;

console.log();

await sleep(1000);
await describe('Vendedores', async (t) => {
  const listVendedores = async (cant) => {
    const listVendedores = await apiFetch('vendedores');
    assert.equal(
      listVendedores.length,
      cant,
      `vendedores list should contain ${cant} records`
    );
  };
  await test('Initially empty', async () => await listVendedores(0));
  await test('inserting two records', async () =>
    await Promise.all(
      vendedores.map(async (v) => {
        const newV = await apiFetch('vendedores', 'POST', v);
        if (newV) {
          const { id, ...rest } = newV;

          assert.deepEqual(
            rest,
            v,
            `returned vendedor doesn't match what was sent`
          );
          assert.equal(
            typeof id,
            'string',
            'in vendedores, id should be a string'
          );
          assert(
            id.length > 0,
            'in vendedores, id should be a non-empty string'
          );
          v.id = id;
        } else assert.fail('create returned null');
      })
    ));

  await test('Attempting insert with no record', async () =>
    await assert.rejects(
      apiFetch('vendedores', 'POST', {}),
      {
        code: 400,
        msg: 'No data to insert',
      },
      'no rechazó el pedido incompleto'
    ));

  await test('There should be two records now', async () =>
    await listVendedores(2));
  await test('Updating vendedores', async () =>
    await Promise.all(
      vendedores.map(async (v) => {
        v.nombre += '1';
        v.email += '.ar';
        const { id, ...rest } = v;
        const updatedV = await apiFetch(`vendedores/${id}`, 'PUT', rest);
        if (updatedV) {
          const { id: uId, ...uRest } = updatedV;

          assert.deepEqual(
            uRest,
            rest,
            `returned vendedor doesn't match what was sent`
          );
          assert.equal(
            uId,
            id,
            'in update of vendedores, id should remain the same'
          );
        }
      })
    ));

  await test('Attempting update with no data', async () =>
    await assert.rejects(
      apiFetch(`vendedores/${vendedores[0].id}`, 'PUT', {}),
      {
        code: 400,
        msg: 'No data to update',
      },
      'no rechazó el pedido incompleto'
    ));

  await test('There should still be two records', async () =>
    await listVendedores(2));
  await test('Delete them', async () =>
    await Promise.all(
      vendedores.map(async (v) => {
        const { id } = v;
        assert(
          await apiFetch(`vendedores/${id}`, 'DELETE'),
          'deleting existing records should return true'
        );
      })
    ));
  await test('There should none now', async () => await listVendedores(0));
});
console.log(`
--------------
pass:     ${pass}
fail:     ${fail}
unknowns: ${unknowns}
--------------


`);
server.kill();
await server;
