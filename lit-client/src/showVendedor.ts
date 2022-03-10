import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BootBase } from './bootstrapBase';
import { ApiTaskGetVendedor } from './api';
import './form';
import './popups';
import './accordion';

@customElement('show-vendedor')
export class ShowVendedor extends LitElement {
  static override readonly styles = [
    BootBase.styles,
    css`
      label {
        margin: 0.3rem 0;
      }
    `,
  ];

  @property()
  idVendedor?: ID;

  private _apiShowVendedor?: ApiTaskGetVendedor;

  override willUpdate(props: PropertyValues) {
    if (props.has('idVendedor')) {
      this._apiShowVendedor = new ApiTaskGetVendedor(this, this.idVendedor!);
    }
  }

  override render() {
    return html`
      <h1>Ventas</h1>
      ${this._apiShowVendedor?.render({
        initial: () => html`<p>Inicial</p>`,
        pending: () => html`<loading-card></loading-card>`,
        complete: (data) => html`
          <form-wrapper>
            <text-field
              label="Nombre"
              name="nombre"
              value=${data.nombre}
              placeholder="Nombre"
              readonly
            ></text-field>
            <email-field
              label="Email"
              name="email"
              value=${data.email || '-'}
              placeholder="Email"
              readonly
            ></email-field>
          </form-wrapper>
          <accordion-base>
            <accordion-panel
              name="ventas"
              heading="Ventas"
              .content=${html`<list-ventas idVendedor=${this.idVendedor}`}
            ></accordion-panel>
            <accordion-panel
              name="consigna"
              heading="Consigna"
              .content=${html`<h2>
                Aquí debería estar la información de libros en consigna
              </h2>`}
            ></accordion-panel>
          </accordion-base>
        `,
        error: (error) =>
          html`<error-card .msg=${(error as Error).toString()}></error-card>`,
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'show-vendedor': ShowVendedor;
  }
}
