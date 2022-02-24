import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import './listVendedores';
import { ROUTER_EVENT, RouterEvent } from './utils';

@customElement('app-root')
export class AppRoot extends LitElement {
  routerEventHandler(ev: RouterEvent) {
    console.log(location.pathname, ev.detail);
  }
  override connectedCallback() {
    super.connectedCallback();
    window.addEventListener(ROUTER_EVENT, this.routerEventHandler);
  }
  override disconnectedCallback() {
    window.removeEventListener(ROUTER_EVENT, this.routerEventHandler);
    super.disconnectedCallback();
  }
  override render() {
    return html`<list-vendedores></list-vendedores>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}
