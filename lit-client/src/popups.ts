import '@lacorazon/lit-icons';
import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { BootBase } from './bootstrapBase';
import { getTarget } from './utils';

export const CONFIRMA_EVENT: 'confirmaEvent' = 'confirmaEvent' as const;

type ConfirmaResult = boolean;

export class ConfirmaEvent extends Event {
  confirma: ConfirmaResult;
  constructor(confirma: ConfirmaResult) {
    super(CONFIRMA_EVENT, { composed: true, bubbles: true });
    this.confirma = confirma;
  }
}

declare global {
  interface HTMLElementEventMap {
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
      : nothing;
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
    this.dispatchEvent(new ConfirmaEvent(button.dataset.action === 'yes'));
  }

  override render() {
    return html`
      <div class=${classMap({ modal: true, show: this.show })} tabindex="-1">
        <div class="modal-dialog">
          <div class="modal-content">
            <div
              class=${classMap({
                'modal-header': true,
                'bg-danger text-white': this.danger,
              })}
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
                class=${classMap({
                  btn: true,
                  'btn-danger': this.danger,
                  'btn-primary': !this.danger,
                })}
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
      : nothing;
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
