import { apiFetch, describe, test, assert } from './testUtils.mjs';
import { users } from './data.mjs';

const url = (page) => (page ? `auth/${page}` : 'auth');

// Important, the users.mjs should be run before this one
// so it leaves one record behind.
const user = users[0];

const auth = async () =>
  await describe('Users', async () => {
    await test('no current User', async () => {
      const reply = await apiFetch(url('currentUser'));
      assert.deepEqual(reply, {}, 'There should not be any user logged in yet');
    });

    await test('login', async () => {
      const { email, password } = users[0];
      const reply = await apiFetch(url('login'), 'POST', {
        email,
        password,
      });
      const { password: _, ...rest } = users[0];
      assert.deepEqual(reply, rest, 'Should have returned the current user');
    });

    await test('Should be logged in', async () => {
      const reply = await apiFetch(url('currentUser'));
      const { password: _, ...rest } = users[0];
      assert.deepEqual(reply, rest, 'Should have returned the current user');
    });

    await test('Logout', async () => {
      const reply = await apiFetch(url('logout'), 'POST');
      assert.deepEqual(reply, {}, 'Should have replied with an empty object');
    });

    await test('login with unknown user', async () =>
      await assert.rejects(
        apiFetch(url('login'), 'POST', {
          email: 'jose',
          password: 'josecito',
        }),
        { code: 401 },
        'Should have returned unauthorized'
      ));
  });
export default auth;
