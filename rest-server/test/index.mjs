#!/usr/bin/env zx
import { strict as assert } from 'node:assert';
import { text } from 'stream/consumers';

process.env.DATABASE = ':memory:';

$.verbose = false;

const vendedores = [
  {
    nombre: 'pepecito',
    email: 'acme@correo.com',
  },
  {
    nombre: 's1',
    email: 'satyam@satyam.com.ar',
  },
];
const xVendedores = {};

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
  { nombre: 'Satyam', email: 'satyam@satyam.com.ar' },
];

const f = (url, method = 'GET', body) => {
  const options = body
    ? {
        method,
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      }
    : { method };
  console.log({ options });
  return fetch(url, options)
    .then((resp) =>
      resp
        .text()
        .then((text) => console.log('¡¡¡¡', text))
        .then(() => resp)
    )
    .then((resp) => {
      if (resp.ok) return resp.json();
      resp.text().then(console.error);
      throw new Error(`?? ${resp.status}: ${resp.statusText}`);
    })
    .then((out) => {
      console.log({ url, method, body, out });
      return out;
    })
    .catch((err) => console.error('!!!', body, typeof body, err));
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
try {
  {
    const listVendedores = await f('http://localhost:3000/api/vendedores');
    console.log(listVendedores);
    assert.equal(listVendedores.length, 0, 'vendedores list should be empty');
  }
  await Promise.all(
    vendedores.map(async (v) => {
      console.log('--', v, JSON.stringify(v));
      const newV = await f('http://localhost:3000/api/vendedores', 'POST', v);
      console.log('===', newV);
      if (newV) {
        const { id, v1 } = newV;

        console.log('+++', id, v1);
        assert.deepEqual(
          v1,
          v,
          `returned vendedor doesn't match what was sent`
        );
        assert.equal(
          typeof id,
          'string',
          'in vendedores, id should be a string'
        );
        assert(id.length > 0, 'in vendedores, id should be a non-empty string');
        xVendedores[id] = {
          id,
          ...v1,
        };
      } else assert.fail('create returned null');
    })
  );
  {
    const listVendedores = await f('http://localhost:3000/api/vendedores');
    assert.equal(
      listVendedores.length,
      vendedores.length,
      'vendedores list should not be empty'
    );
  }
  console.log(xVendedores);
} finally {
  console.log();
  console.log('------------------------------');
  console.log();
  console.log();
  server.kill();
  await server;
}
