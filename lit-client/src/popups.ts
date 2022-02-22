import './icons';
import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BootBase } from './bootstrapBase';

@customElement('loading-card')
export class LoadingCard extends LitElement {
  static override readonly styles = [BootBase.styles];
  override render() {
    return html`
      <div class="alert alert-secondary">
        <icon-wait></icon-wait> Loading ...
      </div>
    `;
  }
}

@customElement('error-card')
export class ErrorCard extends LitElement {
  static override readonly styles = [BootBase.styles];

  @property({ type: String })
  msg = '';

  override render() {
    return html`
      <div id="error" class="alert alert-danger">
        <icon-danger></icon-danger>${this.msg}
      </div>
    `;
  }
}

@customElement('confirma-dialog')
export class ConfirmaDialog extends LitElement {
  static override readonly styles = [BootBase.styles];

  @property({ type: String })
  msg = '';
  @property({ type: String })
  header = '¿Está seguro?';
  @property({ type: Boolean })
  danger = false;

  yesHandler(ev: Event) {
    ev.stopPropagation();
    this.dispatchEvent(
      new Event('yesEvent', { bubbles: true, composed: true })
    );
  }
  noHandler(ev: Event) {
    ev.stopPropagation();
    this.dispatchEvent(new Event('noEvent', { bubbles: true, composed: true }));
  }
  override render() {
    return html`
      <div id="confirm" class="modal fade" tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div
              class=${`modal-header ${
                this.danger ? 'bg-danger text-white' : ''
              }`}
            >
              <h5 class="modal-title">${this.header}</h5>
              <button
                type="button"
                class="btn-close action"
                data-action="no"
              ></button>
            </div>
            <div class="modal-body">${this.msg}</div>
            <div class="modal-footer">
              <button
                type="button"
                class=${`btn ${this.danger ? 'btn-danger' : 'btn-primary'}`}
                @click=${this.yesHandler}
              >
                Aceptar
              </button>
              <button
                type="button"
                class="btn btn-secondary action"
                @click=${this.noHandler}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }
}

@customElement('not-found')
export class NotFound extends LitElement {
  static override readonly styles = [BootBase.styles];
  override render() {
    return html`
      <div id="notFound">
        <div class="alert alert-warning">Path not found</div>
      </div>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'loading-card': LoadingCard;
    'error-card': ErrorCard;
    'confirma-dialog': ConfirmaDialog;
    'not-found': NotFound;
  }
}
