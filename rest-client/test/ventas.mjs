import { describe, test, assert } from './testUtils.mjs';
import {
  apiCreateVenta,
  apiGetVenta,
  apiListVentas,
  apiRemoveVenta,
  apiUpdateVenta,
} from '../dist/ventas.js';
import { apiCreateVendedor, apiRemoveVendedor } from '../dist/vendedores.js';
import { ventas, vendedores } from './data.mjs';

const ventaYVendedor = (venta) => ({
  ...venta,
  vendedor: venta.idVendedor
    ? vendedores.find((vd) => vd.id === venta.idVendedor).nombre
    : null,
});

ventas.forEach((v) => {
  if (v.fecha) v.fecha = new Date(v.fecha);
});
const vt = async () =>
  await describe('Ventas', async () => {
    const countVentas = async (cant) => {
      const listVentas = await apiListVentas();
      assert.equal(
        listVentas.length,
        cant,
        `ventas list should contain ${cant} records`
      );
    };

    await test('inserting vendedores', async () =>
      await Promise.all(
        vendedores.map(async (vendedor) => {
          const newV = await apiCreateVendedor(vendedor);
          if (newV) {
            vendedor.id = newV.id;
          } else assert.fail('create vendedor returned null');
        })
      ));
    ventas[0].idVendedor = vendedores[0].id;
    ventas[1].idVendedor = vendedores[1].id;
    ventas[2].idVendedor = vendedores[1].id;

    await test('Initially empty', async () => await countVentas(0));

    await test('inserting all ventas', async () =>
      await Promise.all(
        ventas.map(async (venta) => {
          const newVenta = await apiCreateVenta(venta);
          venta.iva = !!venta.iva;
          venta.idVendedor = venta.idVendedor ?? null;
          if (newVenta) {
            newVenta.iva = !!newVenta.iva;
            const { id, ...restNV } = newVenta;

            assert.deepEqual(
              restNV,
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
          const inserted = await apiGetVenta(venta.id);
          inserted.iva = !!inserted.iva;

          assert.deepEqual(inserted, ventaYVendedor(venta), 'no match');
        })
      ));

    await test('Attempting insert with no record', async () =>
      await assert.rejects(
        apiCreateVenta({}),
        {
          code: 400,
          msg: 'No data to insert',
        },
        'no rechazó el pedido incompleto'
      ));

    await test(`There should be ${ventas.length} records now`, async () =>
      await countVentas(ventas.length));

    await test('Updating ventas', async () =>
      await Promise.all(
        ventas.map(async (venta) => {
          venta.cantidad *= 2;
          venta.iva = !venta.iva;
          const { id, cantidad, iva } = venta;
          const updatedVenta = await apiUpdateVenta(venta.id, {
            cantidad,
            iva,
          });
          if (updatedVenta) {
            updatedVenta.iva = !!updatedVenta.iva;
            const { id: uId, ...uRest } = updatedVenta;

            assert.deepEqual(
              updatedVenta,
              venta,
              `returned venta doesn't match what was sent`
            );
          }
        })
      ));

    await test('checking the updated data', async () =>
      await Promise.all(
        ventas.map(async (venta) => {
          const updated = await apiGetVenta(venta.id);
          updated.iva = !!updated.iva;
          assert.deepEqual(updated, ventaYVendedor(venta), 'no match');
        })
      ));

    await test('Attempting update with no data', async () =>
      await assert.rejects(
        apiUpdateVenta(ventas[0].id, {}),
        {
          code: 400,
          msg: 'No data to update',
        },
        'no rechazó el alta sin datos'
      ));

    await test(`There should still be ${ventas.length} records`, async () =>
      await countVentas(ventas.length));

    await test('Probando listado en lugar de busquedas individuales', async () => {
      const listVentas = await apiListVentas();
      return Promise.all(
        listVentas.map((venta) => {
          venta.iva = !!venta.iva;
          return assert.deepEqual(
            venta,
            ventaYVendedor(ventas.find((v) => v.id === venta.id)),
            'Venta no se corresponde'
          );
        })
      );
    });

    await test('Probando listado de ventas por vendedor', async () => {
      const listVentas = await apiListVentas(vendedores[1].id);
      return Promise.all(
        listVentas.map((venta) => {
          venta.iva = !!venta.iva;
          return assert.deepEqual(
            venta,
            ventas.find((v) => v.id === venta.id),
            'Venta no se corresponde'
          );
        })
      );
    });

    await test('Delete them', async () =>
      await Promise.all(
        ventas.map(async (venta) => {
          const { id } = venta;
          assert(
            await apiRemoveVenta(id),
            'deleting existing records should return true'
          );
        })
      ));

    await test('There should none now', async () => await countVentas(0));

    await test('Deleting inserted vendedores', async () =>
      await Promise.all(
        vendedores.map(async (vendedor) => {
          assert(
            await apiRemoveVendedor(vendedor.id),
            'deleting existing records should return true'
          );
        })
      ));
  });

export default vt;
