import { apiFetch, describe, test, assert, report } from './testUtils.mjs';
import { vendedores } from './data.mjs';

const url = (id) => (id ? `vendedores/${id}` : 'vendedores');

const v = async () =>
  await describe('Vendedores', async (t) => {
    const listVendedores = async (cant) => {
      const listVendedores = await apiFetch(url());
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
          const newV = await apiFetch(url(), 'POST', v);
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
        apiFetch(url(), 'POST', {}),
        {
          code: 400,
          msg: 'No data to insert',
        },
        'no rechazó el pedido incompleto'
      ));

    await test('Attempting insert with duplicate nombre', async () =>
      await assert.rejects(
        apiFetch(url(), 'POST', vendedores[0]),
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
          const updatedV = await apiFetch(url(id), 'PUT', rest);
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
          const updated = await apiFetch(url(v.id), 'GET');
          assert.deepEqual(updated, v, 'no match');
        })
      ));

    await test('Attempting update with no data', async () =>
      await assert.rejects(
        apiFetch(url(vendedores[0].id), 'PUT', {}),
        {
          code: 400,
          msg: 'No data to update',
        },
        'no rechazó el alta sin datos'
      ));

    await test('Attempting update with duplicate field value nombre', async () =>
      await assert.rejects(
        apiFetch(url(vendedores[0].id), 'PUT', {
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
            await apiFetch(url(id), 'DELETE'),
            'deleting existing records should return true'
          );
        })
      ));

    await test('There should none now', async () => await listVendedores(0));
  });

export default v;
