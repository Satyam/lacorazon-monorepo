import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageBase } from './pageBase';
import { apiGetVenta } from './api';
import './form';
import './popups';

@customElement('show-venta')
export class ShowVenta extends PageBase<VentaYVendedor> {
  @property()
  idVenta?: ID;

  override dataLoader() {
    return apiGetVenta(this.idVenta!);
  }

  override pageBody(data: VentaYVendedor) {
    return html`
      <h1>Ventas</h1>
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
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'show-venta': ShowVenta;
  }
}
