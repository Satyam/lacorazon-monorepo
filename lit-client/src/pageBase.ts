import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { BootBase } from './bootstrapBase';
import './popups';

@customElement('page-base')
export class PageBase<Data> extends LitElement {
  static override readonly styles = [
    BootBase.styles,
    css`
      label {
        margin: 0.3rem 0;
      }
    `,
  ];

  @state()
  protected _error?: string;

  @state()
  protected _loading?: boolean;

  @state()
  protected _data?: Data;

  protected apiThen = (data: Data) => {
    this._data = data;
    this._loading = false;
  };
  protected apiCatch = (error: Error) => {
    this._error = error.toString();
    this._loading = false;
  };

  protected dataLoader(): Promise<Data> {
    return Promise.reject();
  }

  override willUpdate() {
    if (!this._data) {
      this._loading = true;
      this.dataLoader().then(this.apiThen, this.apiCatch);
    }
  }

  protected pageBody(data: Data) {
    return html`${data}`;
  }

  override render() {
    if (this._error) {
      return html`<error-card msg=${this._error || ''}></error-card>`;
    }
    if (this._loading) {
      return html`<loading-card></loading-card>`;
    }
    if (this._data) {
      return this.pageBody(this._data);
    }
    return html`
      <div class="alert alert-info">
        <icon-wait></icon-wait> Initializing ...
      </div>
    `;
  }
}
