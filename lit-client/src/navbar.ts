import { LitElement, html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { BootBase } from './bootstrapBase';
import { getTarget, router } from './utils';
import { apiFetch } from './apiService';
import { classMap } from 'lit/directives/class-map.js';
import { logout } from './login';

export const NAV_EVENT: 'navEvent' = 'navEvent' as const;

type NavEventDetail = string;

export class NavEvent extends CustomEvent<NavEventDetail> {
  constructor(detail: NavEventDetail) {
    super(NAV_EVENT, { detail, bubbles: true, composed: true });
  }
}

declare global {
  interface WindowEventMap {
    [NAV_EVENT]: NavEvent;
  }
}

@customElement('nav-link')
// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class NavLink extends LitElement {
  static override readonly styles = [BootBase.styles];

  @property({ type: String })
  path = '';
  @property({ type: String })
  activePath = '';

  private clickHandler(ev: Event) {
    ev.preventDefault();
    const $el = getTarget<HTMLAnchorElement>(ev);
    const path = $el.pathname;
    if (path === location.pathname) return;

    this.dispatchEvent(new NavEvent(this.path));
  }
  override render() {
    return html`
      <a
        class=${classMap({
          'nav-link': true,
          active: this.activePath === this.path,
        })}
        @click=${this.clickHandler}
        href=${this.path}
        ><slot></slot
      ></a>
    `;
  }
}

@customElement('nav-bar')
export class NavBar extends LitElement {
  static override readonly styles = [BootBase.styles];

  @state()
  private _activeItem = '';

  @state()
  private _collapsed = false;

  private goHome(ev: Event) {
    ev.preventDefault();
    router.push('/');
  }

  private toggler(ev: Event) {
    ev.preventDefault();
    this._collapsed = !this._collapsed;
  }
  private menuHandler(ev: NavEvent) {
    ev.preventDefault();
    const path = ev.detail;

    this._activeItem = path;

    switch (path) {
      case '/logout':
        apiFetch('auth', {
          op: 'logout',
        }).then(logout, logout);
        break;
      default:
        this._collapsed = false;
        router.push(path);
        break;
    }
  }
  override render() {
    return html`
      <nav
        id="navbar"
        class="navbar navbar-light navbar-expand-lg"
        @navEvent=${this.menuHandler}
      >
        <a class="navbar-brand" href="#" @click=${this.goHome}
          ><img src="/La Corazon.png" alt="La Corazón" /> La Corazón</a
        >
        <button class="navbar-toggler" type="button" @click=${this.toggler}>
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class=${classMap({
            collapse: true,
            'navbar-collapse': true,
            show: this._collapsed,
          })}
        >
          <ul class="navbar-nav me-auto logged-in" @click=${this.menuHandler}>
            <li class="nav-item">
              <nav-link path="/usuarios" activePath=${this._activeItem}
                >Usuarios</nav-link
              >
            </li>
            <li class="nav-item">
              <nav-link path="/vendedores" activePath=${this._activeItem}
                >Vendedores</nav-link
              >
            </li>
            <li class="nav-item">
              <nav-link path="/distribuidores" activePath=${this._activeItem}
                >Distribuidores</nav-link
              >
            </li>
            <li class="nav-item">
              <nav-link path="/ventas" activePath=${this._activeItem}
                >Ventas</nav-link
              >
            </li>
          </ul>
          <span class="navbar-text ms-auto">
            <i class="bi bi-person-x logged-out"> Invitado</i>
            <i class="bi bi-person-check-fill logged-in">
              <span class="user-name"></span
            ></i>
          </span>
          <ul class="navbar-nav" @click=${this.menuHandler}>
            <li class="nav-item logged-out">
              <nav-link path="/login" activePath=${this._activeItem}
                >Login</nav-link
              >
            </li>
            <li class="nav-item logged-in">
              <nav-link path="/logout" activePath=${this._activeItem}
                >Logout</nav-link
              >
            </li>
          </ul>
        </div>
      </nav>
      <h1></h1>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'nav-bar': NavBar;
  }
}
