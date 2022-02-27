import './icons';
import './popups';
import { LitElement, html } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { BootBase } from './bootstrapBase';
import { ApiService, apiFetch } from './apiService';
import { getClosest, getTarget, router } from './utils';
import { ConfirmaEvent } from './popups';

const renderRow = (row: Vendedor, id: ID) => html`
  <tr data-id=${id}>
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
export class ListVendedores extends LitElement {
  static override readonly styles = [BootBase.styles];

  private apiListVendedores = new ApiService<{}, Vendedor[]>(
    this,
    'vendedores',
    {
      op: 'list',
    }
  );

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
    if (ev.detail === 'yes') {
      apiFetch('vendedores', {
        op: 'remove',
        id: this._id,
      })
        .then(() => router.replace(`/vendedores`, true))
        .catch((error) => {
          this._error = error.toString();
        });
    }
  }

  override render() {
    return html`
      <error-card msg=${this._error || ''}></error-card>
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
          ${this.apiListVendedores.render({
            initial: () => html`<p>Inicial</p>`,
            pending: () => html`<loading-card></loading-card>`,
            complete: (data) => repeat(data, (data) => data.id, renderRow),
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
    'list-vendedores': ListVendedores;
  }
}
