import { html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { Ref, createRef, ref } from 'lit/directives/ref.js';
import { PageBase } from './pageBase';
import { router } from './utils';
import {
  apiGetVenta,
  apiCreateVenta,
  apiUpdateVenta,
  apiListVendedores,
} from '@lacorazon/post-client';
import {
  FormSubmitEvent,
  FormChangedEvent,
  NumberField,
} from '@lacorazon/lit-form';
import './popups';

@customElement('edit-venta')
export class EditVenta extends PageBase<VentaYVendedor> {
  @property()
  idVenta?: ID;

  @state()
  _options: AnyRow[] = [];

  override dataLoader() {
    return apiListVendedores()
      .then((data) => {
        this._options = data;
      }, this.apiCatch)
      .then(() => apiGetVenta(this.idVenta!));
  }

  submit(ev: FormSubmitEvent) {
    const data = ev.wrapper.values;
    this._loading = true;
    if (this.idVenta) {
      apiUpdateVenta({ id: this.idVenta, ...data } as Venta).then(
        this.apiThen,
        this.apiCatch
      );
    } else {
      apiCreateVenta(data as Venta).then((resp) => {
        router.replace(`/venta/edit/${resp.id}`);
      }, this.apiCatch);
    }
  }

  protected precioTotalFieldRef: Ref<NumberField> = createRef();

  formChanged(ev: FormChangedEvent) {
    const precioTotalField = this.precioTotalFieldRef.value;
    if (precioTotalField) {
      const values = ev.wrapper.values as Venta;
      precioTotalField.value =
        (values.cantidad || 0) * (values.precioUnitario || 0);
    }
  }

  renderForm(data: VentaYVendedor) {
    return html`
      <form-wrapper @formSubmit=${this.submit} @formChanged=${this.formChanged}
        ><form>
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
            labelFieldName="nombre"
            valueFieldName="id"
            .options=${this._options}
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
            ${ref(this.precioTotalFieldRef)}
          ></currency-field>
          <button type="submit" class="btn btn-primary" disabled>
            Acceder
          </button>
        </form>
      </form-wrapper>
    `;
  }
  override pageBody(data: VentaYVendedor) {
    return html`
      <h1>Ventas</h1>
      ${this.renderForm(
        this.idVenta
          ? data
          : ({
              id: 0,
              concepto: '',
              fecha: new Date(),
              idVendedor: 0,
              cantidad: 1,
              precioUnitario: 12,
              iva: false,
            } as VentaYVendedor)
      )}
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'edit-venta': EditVenta;
  }
}
