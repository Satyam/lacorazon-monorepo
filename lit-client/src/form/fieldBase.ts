import { LitElement, html, css, TemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Ref, createRef } from 'lit/directives/ref.js';
import { BootBase } from '../bootstrapBase';
import { getTarget } from '../utils';

export class InputChanged extends Event {
  name: string;
  value: string;
  constructor(name: string, value: string) {
    super('inputChanged', { composed: true, bubbles: true });
    this.name = name;
    this.value = value;
  }
}

@customElement('field-base')
export class FieldBase extends LitElement {
  static override readonly styles = [
    BootBase.styles,
    css`
      label {
        margin: 0.3rem 0;
      }
    `,
  ];

  @property({ type: String })
  label = '';

  @property({ type: String })
  name = '';

  @property({ type: String, reflect: true })
  value = '';

  @property({ type: String })
  placeholder = '';

  @property({ type: String })
  errorFeedback = '';

  @property({ type: String })
  hint = '';

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean })
  readonly = false;

  @property({ type: Boolean })
  disabled = false;

  fieldRef: Ref<HTMLInputElement> = createRef();

  public checkValidity() {
    const field = this.fieldRef.value;
    if (field) {
      const valid = field.checkValidity();
      field.classList.add(valid ? 'is-valid' : 'is-invalid');
      return valid;
    } else {
      return false;
    }
  }
  protected inputHandler(ev: Event) {
    ev.preventDefault();
    this.fieldRef.value?.classList.remove('is-valid', 'is-invalid');
    this.value = getTarget<HTMLInputElement>(ev).value;
    return this.dispatchEvent(new InputChanged(this.name, this.value));
  }

  protected fieldFrame(content: TemplateResult) {
    return html`
      <label class="form-group row">
        <div class="col-sm-2 col-form-label">${this.label}</div>
        <div class="col-sm-10">
          ${content}
          ${this.errorFeedback
            ? html`<div class="invalid-feedback">${this.errorFeedback}</div>`
            : null}
          ${this.hint ? html`<div class="form-text">${this.hint}</div>` : null}
        </div>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'field-base': FieldBase;
  }
}
