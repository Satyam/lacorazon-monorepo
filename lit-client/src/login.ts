import { LitElement, html, css } from 'lit';
import { customElement } from 'lit/decorators.js';
import { BootBase } from './bootstrapBase';
import {
  apiLogin,
  apiLogout,
  apiIsLoggedIn,
  CurrentUser,
} from '@lacorazon/post-client';
import '@lacorazon/lit-form';
import { FormSubmitEvent } from '@lacorazon/lit-form';
import { router } from './utils';

export const LOGIN_EVENT: 'loginEvent' = 'loginEvent' as const;

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

let currentUser: CurrentUser = null;

export const isLoggedIn = () => !!currentUser;

export function checkLoggedIn() {
  return apiIsLoggedIn().then((user) => {
    if (user) {
      currentUser = user;
      window.dispatchEvent(new LoginEvent(currentUser));
      setTimeout(checkLoggedIn, 1_800_000);
    } else {
      if (currentUser) {
        currentUser = null;
        window.dispatchEvent(new LoginEvent(currentUser));
        setTimeout(logout, 0);
      }
    }
  });
}

export function logout() {
  // To ensure everything is erased, do actually navigate and get everything refreshed
  apiLogout().then(() => location.replace('/'));
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

  submit(ev: FormSubmitEvent) {
    const data = ev.values;
    if (data) {
      apiLogin(data).then((user) => {
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
        <email-field
          label="Email"
          name="email"
          placeholder="e-Mail"
          errorFeedback="Debe indicar una direcci??n de correo v??lida y que coincida con la registrada"
          required
        ></email-field>
        <text-field
          label="Contrase??a"
          name="password"
          placeholder="Contrase??a"
          required
          password
          errorFeedback="Debe indicar una contrase??a"
        ></text-field>
        <button type="submit" class="btn btn-primary" disabled>Acceder</button>
      </form-wrapper>
    `;
  }
}
