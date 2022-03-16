import './icons';
import './popups';
import { html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';

import { PageBase } from './pageBase';

import { apiListVendedores, apiRemoveVendedor } from '@lacorazon/post-client';
import { getClosest, getTarget, router } from './utils';
import { ConfirmaEvent } from './popups';

const renderRow = (row: Vendedor) => html`
  <tr data-id=${row.id}>
    <td title="Ver detalles" data-action="show">
      <a href="#">${row.nombre}</a>
    </td>
    <td>${row.email}</td>
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

@customElement('list-vendedores')
export class ListVendedores extends PageBase<Vendedor[]> {
  @state()
  private _ask = false;

  private _id?: ID;

  override dataLoader() {
    return apiListVendedores();
  }
  private clickListener(ev: Event) {
    const $t = getTarget(ev);
    const action = getClosest($t, '[data-action]')?.dataset.action;
    if (action) {
      const id = getClosest($t, 'tr').dataset.id;
      this._id = id;
      switch (action) {
        case 'add':
          router.push('/vendedor/new');
          break;
        case 'show':
          router.push(`/vendedor/${id}`);
          break;
        case 'edit':
          router.push(`/vendedor/edit/${id}`);
          break;
        case 'delete':
          this._ask = true;
          break;
      }
    }
  }

  private doDelete(ev: ConfirmaEvent) {
    this._ask = false;
    if (ev.confirma) {
      apiRemoveVendedor(this._id!).then(
        () => router.replace(`/vendedores`, true),
        this.apiCatch
      );
    }
  }

  override pageBody(data: Vendedor[]) {
    return html`
      <confirma-dialog
        ?show=${this._ask}
        msg="¿Quiere borrar este vendedor?"
        danger
        @confirmaEvent=${this.doDelete}
      ></confirma-dialog>
      <h1>Vendedores</h1>
      <table
        class="table table-striped table-hover table-bordered table-responsive table-sm"
        @click="${this.clickListener}"
      >
        <thead class="bg-secondary text-white border border-dark">
          <tr>
            <th>Nombre</th>
            <th>E-mail</th>
            <th class="text-center">
              <button
                type="button"
                class="btn btn-primary"
                data-action="add"
                title="Agregar"
              >
                <icon-person></icon-person>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          ${repeat(data, (data) => data.id, renderRow)}
        </tbody>
      </table>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'list-vendedores': ListVendedores;
  }
}
