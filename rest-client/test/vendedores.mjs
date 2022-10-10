import { describe, test, assert } from './testUtils.mjs';
import { vendedores } from './data.mjs';
import {
  apiListVendedores,
  apiCreateVendedor,
  apiGetVendedor,
  apiRemoveVendedor,
  apiUpdateVendedor,
} from '../dist/vendedores.js';

const v = async () =>
  await describe('Vendedores', async () => {
    const countVendedores = async (cant) => {
      const listVendedores = await apiListVendedores();
      assert.equal(
        listVendedores.length,
        cant,
        `vendedores list should contain ${cant} records`
      );
    };

    await test('Initially empty', async () => await countVendedores(0));

    await test('inserting two records', async () =>
      await Promise.all(
        vendedores.map(async (v) => {
          const newV = await apiCreateVendedor(v);
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
          const inserted = await apiGetVendedor(v.id);
          assert.deepEqual(inserted, v, 'no match');
        })
      ));

    await test('Attempting insert with no record', async () =>
      await assert.rejects(
        apiCreateVendedor(),
        {
          code: 400,
          msg: 'No data to insert',
        },
        'no rechazó el pedido incompleto'
      ));

    await test('Attempting insert with duplicate nombre', async () =>
      await assert.rejects(
        apiCreateVendedor(vendedores[0]),
        {
          code: 409,
          msg: 'UNIQUE constraint failed: Vendedores.nombre',
        },
        'no rechazó el pedido incompleto'
      ));

    await test(`There should be ${vendedores.length} records now`, async () =>
      await countVendedores(vendedores.length));

    await test('Updating vendedores', async () =>
      await Promise.all(
        vendedores.map(async (v) => {
          v.nombre += '1';
          v.email += '.ar';
          const { id, ...rest } = v;
          const updatedV = await apiUpdateVendedor(id, rest);
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
          const updated = await apiGetVendedor(v.id);
          assert.deepEqual(updated, v, 'no match');
        })
      ));

    await test('Attempting update with no data', async () =>
      await assert.rejects(
        apiUpdateVendedor(vendedores[0].id, {}),
        {
          code: 400,
          msg: 'No data to update',
        },
        'no rechazó el alta sin datos'
      ));

    await test('Attempting update with duplicate field value nombre', async () =>
      await assert.rejects(
        apiUpdateVendedor(vendedores[0].id, {
          nombre: vendedores[1].nombre,
        }),
        {
          code: 409,
          msg: 'UNIQUE constraint failed: Vendedores.nombre',
        },
        'no rechazó el nombre duplicado'
      ));

    await test(`There should still be ${vendedores.length} records`, async () =>
      await countVendedores(vendedores.length));

    await test('Delete them', async () =>
      await Promise.all(
        vendedores.map(async (v) => {
          const { id } = v;
          assert(
            await apiRemoveVendedor(id),
            'deleting existing records should return true'
          );
        })
      ));

    await test('There should none now', async () => await countVendedores(0));
  });

export default v;
