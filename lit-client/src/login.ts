import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BootBase } from './bootstrapBase';
import { apiFetch } from './apiService';

export const LOGIN_EVENT: 'loginEvent' = 'loginEvent' as const;

type LoginEventDetail = User | null;

export class LoginEvent extends CustomEvent<LoginEventDetail> {
  constructor(detail: LoginEventDetail) {
    super(LOGIN_EVENT, { detail });
  }
}

declare global {
  interface WindowEventMap {
    [LOGIN_EVENT]: LoginEvent;
  }
}

let currentUser: User | null = null;

export const isLoggedIn = () => !!currentUser;

export function checkLoggedIn() {
  return apiFetch<{}, User>('auth', {
    op: 'isLoggedIn',
  }).then((user) => {
    if (user) {
      currentUser = user;
      window.dispatchEvent(new LoginEvent(currentUser));
      setTimeout(checkLoggedIn, 1_800_000);
    } else {
      if (currentUser) {
        currentUser = null;
        window.dispatchEvent(new LoginEvent(currentUser));
        setImmediate(logout);
      }
    }
  });
}

export function logout() {
  // To ensure everything is erased, do actually navigate and get everything refreshed
  location.replace('/');
}

@customElement('login-form')
export class LoginForm extends LitElement {
  static override readonly styles = [
    BootBase.styles,
    css`
      label {
        margin: 0.3rem 0;
      }
    `,
  ];
  override render() {
    return html`
      <h1>Login</h1>
      <form novalidate>
        <label class="form-group row">
          <div class="col-sm-2 col-form-label">Email</div>
          <div class="col-sm-10">
            <input
              name="email"
              class="form-control"
              placeholder="Email"
              required
            />
            <div class="invalid-feedback">
              Debe indicar la dirección de correo registrada
            </div>
          </div>
        </label>
        <label class="form-group row">
          <div class="col-sm-2 col-form-label">Contraseña</div>
          <div class="col-sm-10">
            <input
              type="password"
              name="password"
              class="form-control"
              placeholder="Contraseña"
              required
            />
            <div class="invalid-feedback">Debe indicar una contraseña</div>
          </div>
        </label>
        <button type="submit" class="btn btn-primary" disabled>Acceder</button>
      </form>
    `;
  }
}
/*import { getById, getFirstByClass, getFirstByTag } from './gets';
import apiService from './apiService';
import Form from './form';
import { show, hide, router } from './utils';

export function setUser(user: Partial<User>) {
  if (user && user.nombre) {
    const $container = getById('container');
    $container.classList.replace('not-logged-in', 'is-logged-in');
    const $navbar = getById('navbar');
    getFirstByClass($navbar, 'user-name').textContent = user.nombre;
  }
}


export const login: Handler<void> = ($el) => {
  const $login = $el || getById('login');
  const form = new Form<Partial<User>>(
    getFirstByTag<HTMLFormElement>($login, 'form'),
    (data) => {
      if (data) {
        apiService<Partial<User>>('auth', {
          op: 'login',
          data,
        }).then((user) => {
          setUser(user);
          setTimeout(checkLoggedIn, 1_800_000);
          router.replace('/');
        });
      }
    }
  );

  return {
    render: () => {
      form.resetForm();
      show($login);
    },
    close: () => {
      form.destroy();
      hide($login);
    },
  };
};
*/
