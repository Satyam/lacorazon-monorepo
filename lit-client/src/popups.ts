import './icons';
import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { BootBase } from './bootstrapBase';
import { getTarget } from './utils';

export const CONFIRMA_EVENT: 'confirmaEvent' = 'confirmaEvent' as const;

type ConfirmaEventDetail = 'yes' | 'no';

export class ConfirmaEvent extends CustomEvent<ConfirmaEventDetail> {
  constructor(detail: ConfirmaEventDetail) {
    super(CONFIRMA_EVENT, { detail });
  }
}

declare global {
  interface WindowEventMap {
    [CONFIRMA_EVENT]: ConfirmaEvent;
  }
}

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
    return this.msg.length
      ? html`
          <div class="alert alert-danger">
            <icon-danger></icon-danger> ${this.msg}
          </div>
        `
      : null;
  }
}

@customElement('confirma-dialog')
export class ConfirmaDialog extends LitElement {
  static override readonly styles = [
    BootBase.styles,
    css`
      .show {
        display: block;
      }
    `,
  ];

  @property({ type: Boolean })
  show = false;
  @property({ type: String })
  msg = '';
  @property({ type: String })
  header = '¿Está seguro?';
  @property({ type: Boolean })
  danger = false;

  clickHandler(ev: Event) {
    ev.stopPropagation();
    const button = getTarget(ev);
    this.dispatchEvent(
      new ConfirmaEvent(button.dataset.action as ConfirmaEventDetail)
    );
  }

  override render() {
    return html`
      <div class=${`modal${this.show ? ' show' : ''}`} tabindex="-1">
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
                class="btn-close"
                @click=${this.clickHandler}
                data-action="no"
              ></button>
            </div>
            <div class="modal-body">${this.msg}</div>
            <div class="modal-footer">
              <button
                type="button"
                class=${`btn ${this.danger ? 'btn-danger' : 'btn-primary'}`}
                @click=${this.clickHandler}
                data-action="yes"
              >
                Aceptar
              </button>
              <button
                type="button"
                class="btn btn-secondary"
                @click=${this.clickHandler}
                data-action="no"
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

  @property({ type: Boolean })
  show = false;

  override render() {
    return this.show
      ? html`<div class="alert alert-warning">Path not found</div>`
      : null;
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
