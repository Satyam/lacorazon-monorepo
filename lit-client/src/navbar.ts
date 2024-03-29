import { LitElement, html, css, nothing } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { BootBase } from './bootstrapBase';
import '@lacorazon/lit-icons';
import { getTarget, router, getClosest } from './utils';
import { classMap } from 'lit/directives/class-map.js';
import { logout, LoginEvent, LOGIN_EVENT } from './login';

export const NAV_EVENT: 'navEvent' = 'navEvent' as const;

type NavEventPath = string;

export class NavEvent extends Event {
  pathName: NavEventPath;
  constructor(pathName: NavEventPath) {
    super(NAV_EVENT, { bubbles: true, composed: true });
    this.pathName = pathName;
  }
}

declare global {
  interface HTMLElementEventMap {
    [NAV_EVENT]: NavEvent;
  }
}

@customElement('nav-link')
export class NavLink extends LitElement {
  static override readonly styles = [
    BootBase.styles,
    css`
      a {
        color: #644240 !important;
      }
      a:hover {
        color: #332221 !important;
      }
    `,
  ];

  @property({ type: String })
  path = '';
  @property({ type: String })
  activePath = '';

  private clickHandler(ev: Event) {
    ev.preventDefault();
    const $el = getClosest<HTMLAnchorElement>(getTarget(ev), 'a');
    const path = $el.pathname;
    if (path === location.pathname) return;

    this.dispatchEvent(new NavEvent(path));
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
      >
        <slot></slot>
      </a>
    `;
  }
}

@customElement('nav-bar')
export class NavBar extends LitElement {
  static override readonly styles = [
    BootBase.styles,
    css`
      .navbar {
        background-color: #e4ccaa !important;
        color: #644240;
      }
      .navbar-brand {
        margin: auto 1em;
      }
      .navbar-brand img {
        width: 1em;
        height: 1em;
      }
    `,
  ];

  @state()
  private _activeItem = '';

  @state()
  private _collapsed = false;

  @state()
  private _currentUser: User | null = null;

  private loginEventHandler = (ev: LoginEvent) => {
    this._currentUser = ev.currentUser;
  };

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener(LOGIN_EVENT, this.loginEventHandler);
  }
  override disconnectedCallback() {
    window.removeEventListener(LOGIN_EVENT, this.loginEventHandler);
    super.disconnectedCallback();
  }
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
    const pathName = ev.pathName;

    this._activeItem = pathName;

    switch (pathName) {
      case '/logout':
        logout();
        break;
      default:
        this._collapsed = false;
        router.push(pathName);
        break;
    }
  }
  override render() {
    return html`
      <nav
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
          ${this._currentUser
            ? html`<ul class="navbar-nav me-auto logged-in">
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
                  <nav-link
                    path="/distribuidores"
                    activePath=${this._activeItem}
                    >Distribuidores</nav-link
                  >
                </li>
                <li class="nav-item">
                  <nav-link path="/ventas" activePath=${this._activeItem}
                    >Ventas</nav-link
                  >
                </li>
              </ul>`
            : nothing}
          <span class="navbar-text ms-auto">
            ${this._currentUser
              ? html`<icon-logged-in></icon-logged-in> ${this._currentUser
                    .nombre}`
              : html`<icon-logged-out></icon-logged-out> Invitado`}
          </span>
          <ul class="navbar-nav">
            ${this._currentUser
              ? html`<li class="nav-item logged-in">
                  <nav-link path="/logout" activePath=${this._activeItem}
                    >Logout</nav-link
                  >
                </li>`
              : html`<li class="nav-item logged-out">
                  <nav-link path="/login" activePath=${this._activeItem}
                    >Login</nav-link
                  >
                </li>`}
          </ul>
        </div>
      </nav>
    `;
  }
}
declare global {
  interface HTMLElementTagNameMap {
    'nav-bar': NavBar;
  }
}
