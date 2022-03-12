import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import { BootBase } from './bootstrapBase';
import { router } from './utils';
import {
  ApiService,
  ApiTaskGetVenta,
  apiCreateVenta,
  apiUpdateVenta,
} from './api';
import { FormSubmit, FormChanged, NumberField } from './form';
import './form';
import './popups';

@customElement('edit-venta')
export class EditVenta extends LitElement {
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

  private _apiGetVenta?: ApiService<undefined, VentaYVendedor>;

  override willUpdate() {
    if (this.idVenta && !this._apiGetVenta) {
      this._apiGetVenta = new ApiTaskGetVenta(this, this.idVenta);
    }
  }

  submit(ev: FormSubmit) {
    const data = ev.values;
    if (this.idVenta) {
      apiUpdateVenta({ id: this.idVenta, ...data } as Venta).then(() =>
        this.requestUpdate()
      );
    } else {
      apiCreateVenta(data as Venta).then((resp) => {
        router.replace(`/venta/edit/${resp.id}`);
      });
    }
  }

  protected fieldRef: Ref<NumberField> = createRef();

  formChanged(ev: FormChanged) {
    const precioTotalField = this.fieldRef.value;
    if (precioTotalField) {
      const values = ev.form.values as Venta;
      precioTotalField.value =
        (values.cantidad || 0) * (values.precioUnitario || 0);
    }
  }

  renderForm(data: VentaYVendedor) {
    return html`
      <form-wrapper
        novalidate
        @formSubmit=${this.submit}
        @formChanged=${this.formChanged}
      >
        <date-field
          label="Fecha"
          name="fecha"
          .value=${data.fecha}
        ></date-field>
        <text-field
          label="Concepto"
          name="concepto"
          value=${data.concepto || ''}
        ></text-field>
        <select-field
          label="Vendedor"
          name="idVendedor"
          value=${data.idVendedor || ''}
          .options=${[
            ['ro', 'Roxana'],
            ['ra', 'Raed'],
            ['rora', 'Roxana y Raed'],
          ]}
        >
        </select-field>
        <number-field
          label="Cantidad"
          name="cantidad"
          value=${data.cantidad || 0}
        ></number-field>
        <currency-field
          label="Precio Unitario"
          name="precioUnitario"
          value=${data.precioUnitario || 0}
        ></currency-field>
        <boolean-field
          checkLabel="IVA"
          name="iva"
          .value=${!!data.iva}
        ></boolean-field>
        <currency-field
          label="Precio Total"
          value=${(data.cantidad || 0) * (data.precioUnitario || 0)}
          readonly
          ${ref(this.fieldRef)}
        ></currency-field>
        <button type="submit" class="btn btn-primary" disabled>Acceder</button>
      </form-wrapper>
    `;
  }
  override render() {
    return html`
      <h1>Ventas</h1>
      ${this.idVenta
        ? this._apiGetVenta?.render({
            initial: () => html`<p>Inicial</p>`,
            pending: () => html`<loading-card></loading-card>`,
            complete: (data) => this.renderForm(data),
            error: (error) =>
              html`<error-card
                .msg=${(error as Error).toString()}
              ></error-card>`,
          })
        : this.renderForm({
            id: 0,
            concepto: '',
            fecha: new Date(),
            idVendedor: 0,
            cantidad: 1,
            precioUnitario: 12,
            iva: false,
          })}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edit-venta': EditVenta;
  }
}
