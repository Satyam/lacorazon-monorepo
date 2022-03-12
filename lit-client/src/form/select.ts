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

  @property({ attribute: false })
  options: string[][] = [];
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
            html`<option value=${opt[0]} ?selected=${opt[0] === this.value}>
              ${opt[1]}
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
