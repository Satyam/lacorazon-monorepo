import './icons';
import './popups';
import { LitElement, html } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { BootBase } from './bootstrapBase';
import { ApiService, apiFetch } from './apiService';
import {
  getClosest,
  getTarget,
  router,
  formatCurrency,
  formatDate,
} from './utils';
import { ConfirmaEvent } from './popups';

@customElement('list-ventas')
export class ListVentas extends LitElement {
  static override readonly styles = [BootBase.styles];

  private apiListVentas = new ApiService<{}, VentaYVendedor[]>(this, {
    service: 'ventas',
    op: 'list',
  });

  @property({ type: String })
  idVendedor?: ID;

  @state()
  private _ask = false;

  @state()
  private _error?: string;

  private _id?: ID;

  private clickListener(ev: Event) {
    const $t = getTarget(ev);
    const action = getClosest($t, '[data-action]')?.dataset.action;
    if (action) {
      const id = getClosest($t, 'tr').dataset.id;
      this._id = id;
      switch (action) {
        case 'add':
          router.push('/venta/new');
          break;
        case 'show':
          router.push(`/venta/${id}`);
          break;
        case 'edit':
          router.push(`/venta/edit/${id}`);
          break;
        case 'delete':
          this._ask = true;
          break;
      }
    }
  }

  private doDelete(ev: ConfirmaEvent) {
    this._ask = false;
    if (ev.detail === 'yes') {
      apiFetch({
        service: 'ventas',
        op: 'remove',
        id: this._id,
      })
        .then(() => router.replace(`/ventas`, true))
        .catch((error) => {
          this._error = error.toString();
        });
    }
  }
  renderRow = (row: VentaYVendedor, id: ID) => html`
    <tr data-id=${id}>
      <td title="Ver detalles" data-action="show">
        <a href="#">${formatDate(row.fecha)}</a>
      </td>
      <td>${row.concepto}</td>
      ${this.idVendedor
        ? null
        : html` <td title="Ver detalle del vendedor" data-action="showVendedor">
            <a href="#">${row.vendedor}</a>
          </td>`}
      <td class="text-end">${row.cantidad}</td>
      <td class="text-end">${formatCurrency(row.precioUnitario)}</td>
      <td class="text-center">${row.iva}</td>
      <td class="text-end">
        ${formatCurrency((row.cantidad || 0) * (row.precioUnitario || 0))}
      </td>

      <td class="text-center">
        <div class="btn-group btn-group-sm">
          <button
            class="btn btn-outline-secondary"
            data-action="edit"
            title="Modificar"
          >
            <icon-pencil></icon-pencil>
          </button>
          <button
            class="btn btn-outline-danger"
            data-action="delete"
            title="Borrar"
          >
            <icon-trash></icon-trash>
          </button>
        </div>
      </td>
    </tr>
  `;

  override render() {
    return html`
      <error-card msg=${this._error || ''}></error-card>
      <confirma-dialog
        ?show=${this._ask}
        msg="¿Quiere borrar esta venta?"
        danger
        @confirmaEvent=${this.doDelete}
      ></confirma-dialog>
      <h1>Ventas</h1>
      <table
        class="table table-striped table-hover table-bordered table-responsive table-sm"
        @click="${this.clickListener}"
      >
        <thead class="bg-secondary text-white border border-dark">
          <tr>
            <th>Fecha</th>
            <th>Concepto</th>
            ${this.idVendedor
              ? null
              : html`<th class="idVendedor">Vendedor</th>`}

            <th>Cantidad</th>
            <th>Precio Unitario</th>
            <th>IVA</th>
            <th>Precio Total</th>
            <th class="text-center">
              <button
                type="button"
                class="btn btn-primary"
                data-action="add"
                title="Agregar"
              >
                <icon-cart></icon-cart>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          ${this.apiListVentas.render({
            initial: () => html`<p>Inicial</p>`,
            pending: () => html`<loading-card></loading-card>`,
            complete: (data) => repeat(data, (data) => data.id, this.renderRow),
            error: (error) =>
              html`<error-card
                .msg=${(error as Error).toString()}
              ></error-card>`,
          })}
        </tbody>
      </table>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'list-ventas': ListVentas;
  }
}
