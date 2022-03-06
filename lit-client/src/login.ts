import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BootBase } from './bootstrapBase';
import { apiFetch } from './apiService';
import './form/textField';
import './form/formWrapper';
import { FormSubmit } from './form/formWrapper';
import { router } from './utils';

export const LOGIN_EVENT: 'loginEvent' = 'loginEvent' as const;

type CurrentUser = Omit<User, 'password'> | null;

export class LoginEvent extends Event {
  currentUser: CurrentUser;
  constructor(currentUser: CurrentUser) {
    super(LOGIN_EVENT);
    this.currentUser = currentUser;
  }
}

declare global {
  interface WindowEventMap {
    [LOGIN_EVENT]: LoginEvent;
  }
}

let currentUser: CurrentUser | null = null;

export const isLoggedIn = () => !!currentUser;

export function checkLoggedIn() {
  return apiFetch<{}, CurrentUser>({
    service: 'auth',
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

  @state()
  private _disabled = true;

  submit(ev: FormSubmit) {
    const data = ev.values;
    if (data) {
      apiFetch<Partial<User>, CurrentUser>({
        service: 'auth',
        op: 'login',
        data,
      }).then((user) => {
        window.dispatchEvent(new LoginEvent(user));
        setTimeout(checkLoggedIn, 1_800_000);
        router.replace('/');
      });
    }
  }
  override render() {
    return html`
      <h1>Login</h1>
      <form-wrapper novalidate @formSubmit=${this.submit}>
        <text-field
          label="Email"
          name="email"
          placeholder="e-Mail"
          errorFeedback="Debe indicar la dirección de correo registrada"
          required
        ></text-field>
        <text-field
          label="Contraseña"
          name="password"
          placeholder="Contraseña"
          required
          password
          errorFeedback="Debe indicar una contraseña"
        ></text-field>
        <button
          type="submit"
          class="btn btn-primary"
          ?disabled=${this._disabled}
        >
          Acceder
        </button>
      </form-wrapper>
    `;
  }
}
