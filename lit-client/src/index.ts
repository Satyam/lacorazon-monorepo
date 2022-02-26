import { LitElement, html, TemplateResult } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './listVendedores';
import './navbar';
import './home';
import './popups';
import { BootBase } from './bootstrapBase';
import { ROUTER_EVENT, RouterEvent } from './utils';

type Route = {
  path: string;
  litElement: (
    params: Record<string, VALUE>,
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
  // {
  //   path: '/vendedor/:id',
  //   module: showVendedor(),
  //   heading: 'Vendedor',
  // },
  // {
  //   path: '/ventas',
  //   module: listVentas(),
  //   heading: 'Ventas',
  // },
  // {
  //   path: '/venta/edit/:id',
  //   module: edVenta,
  //   heading: 'Modificar venta',
  // },
  // {
  //   path: '/venta/new',
  //   module: edVenta,
  //   heading: 'Agregar venta',
  // },
  // {
  //   path: '/venta/:id',
  //   module: showVenta(),
  //   heading: 'Venta',
  // },
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
    const { path, refresh } = ev.detail;
    if (path !== this._currentPath) {
      this._currentPath = path;
    }
    if (refresh) {
      this.requestUpdate();
    }
  };

  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener(ROUTER_EVENT, this.routerEventHandler);
  }
  override disconnectedCallback() {
    window.removeEventListener(ROUTER_EVENT, this.routerEventHandler);
    super.disconnectedCallback();
  }

  private matchPath() {
    const path = this._currentPath;
    const route = routes.find((r) => r.rxRoute && r.rxRoute.test(path));

    return route
      ? route.litElement(
          path.match(route.rxRoute || '')?.groups || {},
          Object.fromEntries(new URLSearchParams(location.search))
        )
      : '';
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
