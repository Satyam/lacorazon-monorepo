#!/usr/bin/env zx
import { apiFetch, describe, test, assert, report } from './testUtils.mjs';
import dotEnv from 'dotenv';

dotEnv.config();
process.env.NODE_ENV = 'test';

$.verbose = false;

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

  await test('checking the inserted data', async () =>
    await Promise.all(
      vendedores.map(async (v) => {
        const inserted = await apiFetch(`vendedores/${v.id}`, 'GET');
        assert.deepEqual(inserted, v, 'no match');
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

  await test('Attempting insert with duplicate nombre', async () =>
    await assert.rejects(
      apiFetch('vendedores', 'POST', vendedores[0]),
      {
        code: 409,
        msg: 'UNIQUE constraint failed: Vendedores.nombre',
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

  await test('checking the updated data', async () =>
    await Promise.all(
      vendedores.map(async (v) => {
        const updated = await apiFetch(`vendedores/${v.id}`, 'GET');
        assert.deepEqual(updated, v, 'no match');
      })
    ));

  await test('Attempting update with no data', async () =>
    await assert.rejects(
      apiFetch(`vendedores/${vendedores[0].id}`, 'PUT', {}),
      {
        code: 400,
        msg: 'No data to update',
      },
      'no rechazó el alta sin datos'
    ));

  await test('Attempting update with duplicate field value nombre', async () =>
    await assert.rejects(
      apiFetch(`vendedores/${vendedores[0].id}`, 'PUT', {
        nombre: vendedores[1].nombre,
      }),
      {
        code: 409,
        msg: 'UNIQUE constraint failed: Vendedores.nombre',
      },
      'no rechazó el nombre duplicado'
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
report();
server.kill();
await server;
