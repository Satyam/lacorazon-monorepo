import { apiFetch, describe, test, assert } from './testUtils.mjs';
import { ventas, vendedores } from './data.mjs';

const url = (id) => (id ? `ventas/${id}` : 'ventas');

const vt = async () =>
  await describe('Ventas', async () => {
    const listVentas = async (cant) => {
      const listVentas = await apiFetch(url());
      assert.equal(
        listVentas.length,
        cant,
        `ventas list should contain ${cant} records`
      );
    };

    await test('inserting vendedores', async () =>
      await Promise.all(
        vendedores.map(async (vendedor) => {
          const newV = await apiFetch('vendedores', 'POST', vendedor);
          if (newV) {
            vendedor.id = newV.id;
          } else assert.fail('create vendedor returned null');
        })
      ));
    ventas[0].idVendedor = vendedores[0].id;
    ventas[1].idVendedor = vendedores[1].id;
    ventas[2].idVendedor = vendedores[1].id;
    console.log(ventas);

    await test('Initially empty', async () => await listVentas(0));

    await test('inserting all ventas', async () =>
      await Promise.all(
        ventas.map(async (venta) => {
          const newVenta = await apiFetch(url(), 'POST', venta);
          if (newVenta) {
            const { id, ...rest } = newVenta;

            assert.deepEqual(
              rest,
              venta,
              `returned venta doesn't match what was sent`
            );
            assert.equal(
              typeof id,
              'number',
              'in ventas, id should be a number'
            );
            assert(id > 0, 'in ventas, id should be greater than 0');
            venta.id = id;
          } else assert.fail('create returned null');
        })
      ));

    await test('checking the inserted data', async () =>
      await Promise.all(
        ventas.map(async (venta) => {
          const inserted = await apiFetch(`ventas/${venta.id}`, 'GET');
          assert.deepEqual(inserted, venta, 'no match');
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

    await test(`There should be ${ventas.length} records now`, async () =>
      await listVentas(ventas.length));

    await test('Updating ventas', async () =>
      await Promise.all(
        ventas.map(async (venta) => {
          venta.cantidad *= 2;
          venta.iva = !venta.iva;
          const { id, ...rest } = venta;
          const updatedVenta = await apiFetch(url(id), 'PUT', rest);
          if (updatedVenta) {
            const { id: uId, ...uRest } = updatedVenta;

            assert.deepEqual(
              uRest,
              rest,
              `returned venta doesn't match what was sent`
            );
            assert.equal(
              uId,
              id,
              'in update of ventas, id should remain the same'
            );
          }
        })
      ));

    await test('checking the updated data', async () =>
      await Promise.all(
        ventas.map(async (venta) => {
          const updated = await apiFetch(url(venta.id), 'GET');
          assert.deepEqual(updated, venta, 'no match');
        })
      ));

    await test('Attempting update with no data', async () =>
      await assert.rejects(
        apiFetch(url(ventas[0].id), 'PUT', {}),
        {
          code: 400,
          msg: 'No data to update',
        },
        'no rechazó el alta sin datos'
      ));

    await test(`There should still be ${ventas.length} records`, async () =>
      await listVentas(ventas.length));

    await test('Delete them', async () =>
      await Promise.all(
        ventas.map(async (venta) => {
          const { id } = venta;
          assert(
            await apiFetch(url(id), 'DELETE'),
            'deleting existing records should return true'
          );
        })
      ));

    await test('There should none now', async () => await listVentas(0));
  });

export default vt;
