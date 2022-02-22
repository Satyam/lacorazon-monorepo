import './icons';
import './popups';
import { LitElement, html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { repeat } from 'lit/directives/repeat.js';
import { BootBase } from './bootstrapBase';
import { ApiService } from './apiService';

const renderRow = (row: Vendedor, id: ID) => html`
  <tr data-id=${id}>
    <td title="Ver detalles" data-action="show" class="action">
      <a href="#">${row.nombre}</a>
    </td>
    <td>${row.email}</td>
    <td class="text-center">
      <div class="btn-group btn-group-sm">
        <button
          class="btn btn-outline-secondary action"
          data-action="edit"
          title="Modificar"
        >
          <icon-pencil></icon-pencil>
        </button>
        <button
          class="btn btn-outline-danger action"
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

  private apiService = new ApiService<{}, Vendedor[]>(this, 'vendedores', {
    op: 'list',
  });

  override render() {
    return html`
      <table
        class="table table-striped table-hover table-bordered table-responsive table-sm"
      >
        <thead class="bg-secondary text-white border border-dark">
          <tr>
            <th>Nombre</th>
            <th>E-mail</th>
            <th class="text-center">
              <button
                type="button"
                class="btn btn-primary action"
                data-action="add"
                title="Agregar"
              >
                <icon-person></icon-person>
              </button>
            </th>
          </tr>
        </thead>
        <tbody>
          ${this.apiService.render({
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
