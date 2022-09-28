import { apiFetch, describe, test, assert } from './testUtils.mjs';
import { users } from './data.mjs';

const url = (page) => (page ? `auth/${page}` : 'auth');

// Important, the users.mjs should be run before this one
// so it leaves one record behind.
const user = users[0];

const auth = async () =>
  await describe('Users', async () => {
    await test('not logged in', async () => {
      await assert.rejects(
        apiFetch(url('isLoggedIn')),
        {
          code: 302,
          location: '/login',
        },
        'Should have redirected to /login'
      );
    });

    await test('login', async () => {
      const { email, password } = users[0];
      await assert.rejects(
        apiFetch(url('login'), 'POST', {
          email,
          password,
        }),
        {
          code: 302,
          location: '/',
        },
        'Should have redirected to root'
      );
    });

    await test('Should be logged in', async () => {
      await assert.rejects(
        apiFetch(url('isLoggedIn')),
        {
          code: 302,
          location: '/login',
        },
        'Should have redirected to /login'
      );
    });
  });

export default auth;
