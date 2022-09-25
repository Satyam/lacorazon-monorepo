#!/usr/bin/env zx
import { AssertionError, strict as assert } from 'node:assert';

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

//const rxBody = /<body>\s*<pre>([\s\S]+)<\/pre>\s*<\/body>/i;
const rxError = /<body>\s*<pre>([\s\S]+?)<br>/i;
class ServerError extends Error {
  constructor(response, body) {
    if (body) {
      const m = rxError.exec(body);
      if (m.length === 2) {
        const b = m[1].replaceAll('&nbsp;', ' ');
        super(b);
      }
    } else {
      super(response.statusText);
    }
    this.code = response.status;
  }
}
const f = async (url, method = 'GET', body) => {
  const options = body
    ? {
        method,
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' },
      }
    : { method };
  const resp = await fetch(url, options);
  if (resp.ok) {
    try {
      return await resp.json();
    } catch (err) {
      const b = await resp.text();
      throw new ServerError(resp, b);
    }
  }
  const b = await resp.text();
  throw new ServerError(resp, b);
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

  console.info('attempting insert with no `nombre`');
  await assert.rejects(
    f('http://localhost:3000/api/vendedores', 'POST', {}),
    {
      code: 500,
      // message: 'dddd',
      // name: 'ServerError',
    },
    'no salto'
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
  if (err instanceof AssertionError) {
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
