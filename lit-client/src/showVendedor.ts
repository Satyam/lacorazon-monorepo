import { LitElement, html, css, PropertyValues } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BootBase } from './bootstrapBase';
import { ApiService } from './apiService';
import './form/textField';
import './form/formWrapper';
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

  private _apiShowVendedor?: ApiService<{}, Vendedor>;

  override willUpdate(props: PropertyValues) {
    if (props.has('idVendedor')) {
      this._apiShowVendedor = new ApiService<{}, Vendedor>(this, {
        service: 'vendedores',
        op: 'get',
        id: this.idVendedor,
      });
    }
  }

  override render() {
    return html`
      <h1>Ventas</h1>
      ${this._apiShowVendedor?.render({
        initial: () => html`<p>Inicial</p>`,
        pending: () => html`<loading-card></loading-card>`,
        complete: (data) => html`
          <form>
            <label class="form-group row">
              <div class="col-sm-2 col-form-label">Nombre</div>
              <div class="col-sm-10">
                <input
                  name="nombre"
                  value=${data.nombre}
                  class="form-control"
                  placeholder="Nombre"
                  readonly
                />
              </div>
            </label>
            <label class="form-group row">
              <div class="col-sm-2 col-form-label">Email</div>
              <div class="col-sm-10">
                <input
                  type="email"
                  name="email"
                  value=${data.email || '-'}
                  class="form-control"
                  placeholder="Email"
                  readonly
                />
              </div>
            </label>
          </form>
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
