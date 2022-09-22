#!/usr/bin/env zx
import { strict as assert } from 'node:assert';

process.env.DATABASE = ':memory:';

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

const f = (url, method = 'GET', body) => {
  const options = body
    ? {
        method,
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      }
    : { method };
  return fetch(url, options)
    .then((resp) => {
      if (resp.ok) {
        try {
          return resp.json();
        } catch (err) {
          console.error(err);
          resp.text().then(console.error);
        }
      }
      resp.text().then(console.error);
      throw new Error(`?? ${resp.status}: ${resp.statusText}`);
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
  const listVendedores = async (cant) => {
    const listVendedores = await f('http://localhost:3000/api/vendedores');
    assert.equal(
      listVendedores.length,
      cant,
      `vendedores list should contain ${cant} records`
    );
  };
  console.info('Vendedores');
  console.info('Initially empty');
  await listVendedores(0);
  console.log('inserting two records');
  await Promise.all(
    vendedores.map(async (v) => {
      const newV = await f('http://localhost:3000/api/vendedores', 'POST', v);
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
        assert(id.length > 0, 'in vendedores, id should be a non-empty string');
        v.id = id;
      } else assert.fail('create returned null');
    })
  );
  console.log('There should be two records now');
  await listVendedores(2);
  console.log('Updating vendedores');
  await Promise.all(
    vendedores.map(async (v) => {
      v.nombre += '1';
      v.email += '.ar';
      const { id, ...rest } = v;
      const updatedV = await f(
        `http://localhost:3000/api/vendedores/${id}`,
        'PUT',
        rest
      );
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
  );
  console.log('There should still be two records');
  await listVendedores(2);
  console.log('Delete them');
  await Promise.all(
    vendedores.map(async (v) => {
      const { id } = v;
      assert(
        await f(`http://localhost:3000/api/vendedores/${id}`, 'DELETE'),
        'deleting existing records should return true'
      );
    })
  );
  console.log('There should none now');
  await listVendedores(0);
} catch (err) {
  if (err.code === 'ERR_ASSERTION') {
    console.log('-----------------------');
    console.log(
      err
        .toString()
        .replace('AssertionError [ERR_ASSERTION]', chalk.yellow(err.operator))
    );
    console.log(chalk.red(JSON.stringify(err.actual, null, 2)));
    console.log(chalk.green(JSON.stringify(err.expected, null, 2)));
  } else console.error(err);
} finally {
  console.log();
  console.log('------------------------------');
  console.log();
  console.log();
  server.kill();
  await server;
}
