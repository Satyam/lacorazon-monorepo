import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';
import { ref } from 'lit/directives/ref.js';

@customElement('select-field')
export class SelectField extends FieldBase<string> {
  @property({ type: String })
  override value = '';

  @property({ type: Boolean })
  multiple = false;

  @property({ type: Number })
  size = 0;

  @property({ type: String })
  labelFieldName = '';

  @property({ type: String })
  valueFieldName = '';

  @property({ attribute: false })
  options: AnyRow[] = [];
  // Not sure why I had to do this.
  override reset() {
    super.reset();
    this.fieldEl().value = this.value;
  }

  override inputControl() {
    return html`
      <select
        name=${this.name}
        class="form-control"
        ?multiple=${this.multiple}
        size=${this.size}
        ?required=${this.required}
        ?disabled=${this.disabled}
        @input=${this.inputHandler}
        ${ref(this.fieldRef)}
      >
        ${this.options.map(
          (opt) =>
            html`<option
              value=${String(opt[this.valueFieldName])}
              ?selected=${String(opt[this.valueFieldName]) === this.value}
            >
              ${opt[this.labelFieldName]}
            </option>`
        )}
      </select>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'select-field': SelectField;
  }
}
