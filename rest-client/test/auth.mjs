import { apiFetch, describe, test, assert } from './testUtils.mjs';
import { apiCreateUser, apiRemoveUser } from '../dist/users.js';
import { apiCurrentUser, apiLogin, apiLogout } from '../dist/auth.js';
import { users } from './data.mjs';

const url = (page) => (page ? `auth/${page}` : 'auth');

const user = users[0];

const auth = async () =>
  await describe('Auth', async () => {
    await test('inserting one user', async () => {
      const newUser = await apiCreateUser(user);
      if (newUser) {
        user.id = newUser.id;
      } else assert.fail('create user returned null');
    });

    await test('no current User', async () => {
      const reply = await apiCurrentUser();
      assert.deepEqual(reply, {}, 'There should not be any user logged in yet');
    });

    await test('login', async () => {
      const { email, password } = user;
      const reply = await apiLogin({
        email,
        password,
      });
      const { password: _, ...rest } = user;
      assert.deepEqual(reply, rest, 'Should have returned the current user');
    });

    await test('Should be logged in', async () => {
      const reply = await apiCurrentUser();
      const { password: _, ...rest } = user;
      assert.deepEqual(reply, rest, 'Should have returned the current user');
    });

    await test('Logout', async () => {
      const reply = await apiLogout();
      assert.deepEqual(reply, {}, 'Should have replied with an empty object');
    });

    await test('login with unknown user', async () =>
      await assert.rejects(
        apiLogin({
          email: 'jose',
          password: 'josecito',
        }),
        { code: 401 },
        'Should have returned unauthorized'
      ));
    await test('Deleting inserted user', async () =>
      assert(
        await apiRemoveUser(user.id),
        'deleting existing user should return true'
      ));
  });
export default auth;
