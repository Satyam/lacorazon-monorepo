import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BootBase } from './bootstrapBase';
import { ApiService, ApiTaskGetVenta } from './api';
import './form';
import './popups';
import './accordion';

@customElement('show-venta')
export class ShowVenta extends LitElement {
  static override readonly styles = [
    BootBase.styles,
    css`
      label {
        margin: 0.3rem 0;
      }
    `,
  ];

  @property()
  idVenta?: ID;

  private _apiShowVenta?: ApiService<undefined, VentaYVendedor>;

  override willUpdate(props: PropertyValues) {
    if (props.has('idVenta')) {
      this._apiShowVenta = new ApiTaskGetVenta(this, this.idVenta!);
    }
  }

  override render() {
    return html`
      <h1>Ventas</h1>
      ${this._apiShowVenta?.render({
        initial: () => html`<p>Inicial</p>`,
        pending: () => html`<loading-card></loading-card>`,
        complete: (data) => html`
          <form-wrapper>
            <date-field
              label="Fecha"
              name="fecha"
              .value=${data.fecha}
              readonly
            ></date-field>
            <text-field
              label="Concepto"
              name="concepto"
              value=${data.concepto || ''}
              readonly
            ></text-field>
            <text-field
              label="Vendedor"
              name="vendedor"
              value=${data.vendedor || '-'}
              readonly
            ></text-field>
            <number-field
              label="Cantidad"
              name="cantidad"
              value=${data.cantidad || 0}
              readonly
            ></number-field>
            <currency-field
              label="Precio Unitario"
              name="precioUnitario"
              value=${data.precioUnitario || 0}
              readonly
            ></currency-field>
            <boolean-field
              checkLabel="IVA"
              name="iva"
              .value=${!!data.iva}
              readonly
            ></boolean-field>
            <currency-field
              label="Precio Total"
              name="precioTotal"
              value=${(data.cantidad || 0) * (data.precioUnitario || 0)}
              readonly
            ></currency-field>
          </form-wrapper>
        `,
        error: (error) =>
          html`<error-card .msg=${(error as Error).toString()}></error-card>`,
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'show-venta': ShowVenta;
  }
}
