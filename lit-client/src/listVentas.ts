import './icons';
import './popups';
import { html, nothing } from 'lit';
import { customElement, state, property } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { PageBase } from './pageBase';

import { apiRemoveVenta, apiListVentas } from '@lacorazon/post-client';

import {
  getClosest,
  getTarget,
  router,
  formatCurrency,
  formatDate,
} from './utils';
import { ConfirmaEvent } from './popups';

@customElement('list-ventas')
export class ListVentas extends PageBase<VentaYVendedor[]> {
  @property({ type: String })
  idVendedor?: ID;

  @state()
  private _ask = false;

  private _id?: ID;

  override dataLoader() {
    return apiListVentas();
  }

  private clickListener(ev: Event) {
    ev.preventDefault();
    const $t = getTarget<HTMLAnchorElement>(ev);
    const { action, idvendedor: idVendedor } = getClosest(
      $t,
      '[data-action]'
    )?.dataset;
    if (action) {
      const id = getClosest($t, 'tr').dataset.id;
      switch (action) {
        case 'add':
          router.push('/venta/new');
          break;
        case 'show':
          router.push(`/venta/${id}`);
          break;
        case 'showVendedor':
          router.push(`/vendedor/${idVendedor}`);
          break;
        case 'edit':
          router.push(`/venta/edit/${id}`);
          break;
        case 'delete':
          this._id = id;
          this._ask = true;
          break;
      }
    }
  }

  private doDelete(ev: ConfirmaEvent) {
    this._ask = false;
    if (ev.confirma) {
      this._loading = true;
      apiRemoveVenta(this._id!).then(
        () => router.replace(`/ventas`, true),
        this.apiCatch
      );
    }
  }

  renderRow = (row: VentaYVendedor) => html`
    <tr data-id=${row.id}>
      <td title="Ver detalles" data-action="show">
        <a href="#">${formatDate(row.fecha)}</a>
      </td>
      <td>${row.concepto}</td>
      ${this.idVendedor
        ? nothing
        : html`
            <td
              title="Ver detalle del vendedor"
              data-action="showVendedor"
              data-idVendedor=${row.idVendedor || 0}
            >
              <a href="/vendedor/${row.idVendedor}">${row.vendedor}</a>
            </td>
          `}
      <td class="text-end">${row.cantidad}</td>
      <td class="text-end">${formatCurrency(row.precioUnitario)}</td>
      <td class="text-center"><icon-check ?value=${row.iva}></icon-check></td>
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

  override pageBody(data: VentaYVendedor[]) {
    return html`
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
              ? nothing
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
          ${repeat(data, (data) => data.id, this.renderRow)}
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
