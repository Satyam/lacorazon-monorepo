/// <reference path="../../types/global.d.ts" />
/// <reference path="../../types/api.d.ts" />
import { LitElement, html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './listVendedores';
import './listVentas';
import './showVendedor';
import './showVenta';
import './editVenta';
import './navbar';
import './home';
import './popups';
import { BootBase } from './bootstrapBase';
import { ROUTER_EVENT, RouterEvent } from './utils';
import { checkLoggedIn } from './login';

type Route = {
  path: string;
  litElement: (
    params: Record<string, VALUE>,
    refresh: boolean,
    opts?: Record<string, VALUE>
  ) => TemplateResult;
  rxRoute?: RegExp;
};

const routes: Array<Route> = [
  {
    path: '/',
    litElement: () => html`<home-page></home-page>`,
  },
  {
    path: '/login',
    litElement: () => html`<login-form></login-form>`,
  },
  {
    path: '/vendedores',
    litElement: () => html`<list-vendedores></list-vendedores>`,
  },
  // {
  //   path: '/vendedor/edit/:id',
  //   module: edVendedor,
  //   heading: 'Modificar vendedor',
  // },
  // {
  //   path: '/vendedor/new',
  //   module: edVendedor,
  //   heading: 'Agregar vendedor',
  // },
  {
    path: '/vendedor/:id',
    litElement: ({ id }) =>
      html`<show-vendedor idVendedor=${id as ID}></show-vendedor>`,
  },
  {
    path: '/ventas',
    litElement: () => html`<list-ventas></list-ventas>`,
  },
  {
    path: '/venta/edit/:id',
    litElement: ({ id }) => html`<edit-venta idVenta=${id as ID}></edit-venta>`,
  },
  {
    path: '/venta/new',
    litElement: () => html`<edit-venta></edit-venta>`,
  },
  {
    path: '/venta/:id',
    litElement: ({ id }) => html`<show-venta idVenta=${id as ID}></show-venta>`,
  },
  {
    path: '*',
    litElement: () => html`<not-found ?show=${true}></not-found>`,
  },
];

@customElement('app-root')
export class AppRoot extends LitElement {
  static override readonly styles = [BootBase.styles];

  @state()
  private _currentPath = location.pathname;

  @state()
  private _refresh = false;

  constructor() {
    super();
    routes.forEach((r) => {
      r.rxRoute = new RegExp(
        `^${r.path
          .split('/')
          .map((p) => {
            if (p.startsWith(':')) return `(?<${p.substring(1)}>[^\\/]*)`;
            if (p === '*') return `(?<$>[^?$]*)`;
            return p;
          })
          .join('\\/')}$`
      );
    });
  }
  routerEventHandler = (ev: RouterEvent) => {
    const { path, refresh } = ev.routing;
    if (path !== this._currentPath) {
      this._currentPath = path;
    }
    this._refresh = !!refresh;
  };

  historyChangeHandler = () => {
    this._currentPath = location.pathname;
  };

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener(ROUTER_EVENT, this.routerEventHandler);
    window.addEventListener('popstate', this.historyChangeHandler);
  }
  override disconnectedCallback() {
    window.removeEventListener(ROUTER_EVENT, this.routerEventHandler);
    window.removeEventListener('popstate', this.historyChangeHandler);
    super.disconnectedCallback();
  }

  private matchPath() {
    const path = this._currentPath;
    const route = routes.find((r) => r.rxRoute && r.rxRoute.test(path));

    return route
      ? route.litElement(
          path.match(route.rxRoute || '')?.groups || {},
          this._refresh,
          Object.fromEntries(new URLSearchParams(location.search))
        )
      : '';
  }

  protected override firstUpdated(): void {
    checkLoggedIn();
  }

  override render() {
    return html`<div class="container">
      <nav-bar></nav-bar>
      ${this.matchPath()}
    </div>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}
