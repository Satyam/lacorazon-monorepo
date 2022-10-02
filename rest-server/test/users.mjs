import { apiFetch, describe, test, assert } from './testUtils.mjs';
import { users } from './data.mjs';

const url = (id) => (id ? `users/${id}` : 'users');

const u = async () =>
  await describe('Users', async () => {
    const countUsers = async (cant) => {
      const listUsers = await apiFetch(url());
      assert.equal(
        listUsers.length,
        cant,
        `users list should contain ${cant} records`
      );
    };
    await test('Initially Empty', async () => await countUsers(0));

    await test('inserting two records', async () =>
      await Promise.all(
        users.map(async (v) => {
          const newV = await apiFetch(url(), 'POST', v);
          if (newV) {
            const { id, ...rest } = newV;
            const { password, ...noPassword } = v;
            assert.deepEqual(
              rest,
              noPassword,
              `returned user doesn't match what was sent`
            );
            assert.equal(
              typeof id,
              'string',
              'in users, id should be a string'
            );
            assert(id.length > 0, 'in users, id should be a non-empty string');
            v.id = id;
          } else assert.fail('create returned null');
        })
      ));

    await test('checking the inserted data', async () =>
      await Promise.all(
        users.map(async (v) => {
          const inserted = await apiFetch(`users/${v.id}`, 'GET');
          const { password, ...noPassword } = v;
          assert.deepEqual(inserted, noPassword, 'no match');
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
        apiFetch(url(), 'POST', users[0]),
        {
          code: 409,
          msg: 'UNIQUE constraint failed: Users.nombre',
        },
        'no rechazó el pedido incompleto'
      ));

    await test(`There should be ${users.length} records now`, async () =>
      await countUsers(users.length));

    await test('Cheking valid users', async () =>
      await Promise.all(
        users.map(async (u) => {
          const { id, nombre, ...credentials } = u;
          const currentUser = await apiFetch(url('check'), 'POST', credentials);
          const { password, ...noPassword } = u;
          assert.deepEqual(currentUser, noPassword, 'user does not check');
        })
      ));
    await test('Updating users', async () =>
      await Promise.all(
        users.map(async (v) => {
          v.nombre += '1';
          v.email += '.ar';
          const { id, ...rest } = v;
          const updatedV = await apiFetch(url(id), 'PUT', rest);
          if (updatedV) {
            const { id: uId, ...uRest } = updatedV;
            const { password, ...noPassword } = rest;
            assert.deepEqual(
              uRest,
              noPassword,
              `returned user doesn't match what was sent`
            );
            assert.equal(
              uId,
              id,
              'in update of users, id should remain the same'
            );
          }
        })
      ));

    await test('checking the updated data', async () =>
      await Promise.all(
        users.map(async (v) => {
          const updated = await apiFetch(url(v.id), 'GET');
          const { password, ...noPassword } = v;
          assert.deepEqual(updated, noPassword, 'no match');
        })
      ));

    await test('Attempting update with no data', async () =>
      await assert.rejects(
        apiFetch(url(users[0].id), 'PUT', {}),
        {
          code: 400,
          msg: 'No data to update',
        },
        'no rechazó el alta sin datos'
      ));

    await test('Attempting update with duplicate field value nombre', async () =>
      await assert.rejects(
        apiFetch(url(users[0].id), 'PUT', {
          nombre: users[1].nombre,
        }),
        {
          code: 409,
          msg: 'UNIQUE constraint failed: Users.nombre',
        },
        'no rechazó el nombre duplicado'
      ));

    await test(`There should still be ${users.length} records`, async () =>
      await countUsers(users.length));

    await test('Delete them all', async () =>
      Promise.all(
        users.map(async (user) =>
          assert(
            await apiFetch(url(user.id), 'DELETE'),
            'deleting existing records should return true'
          )
        )
      ));

    await test('There should none now', async () => await countUsers(0));
  });

export default u;
