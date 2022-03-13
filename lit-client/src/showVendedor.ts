import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PageBase } from './pageBase';
import { apiGetVendedor } from './api';
import './form';
import './popups';
import './accordion';

@customElement('show-vendedor')
export class ShowVendedor extends PageBase<Vendedor> {
  @property()
  idVendedor?: ID;

  override dataLoader() {
    return apiGetVendedor(this.idVendedor!);
  }

  override pageBody(data: Vendedor) {
    return html`
      <h1>Venta</h1>
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
      })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'show-vendedor': ShowVendedor;
  }
}
