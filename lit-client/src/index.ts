import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import './listVendedores';

@customElement('app-root')
export class AppRoot extends LitElement {
  override render() {
    return html`<list-vendedores></list-vendedores>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'app-root': AppRoot;
  }
}
