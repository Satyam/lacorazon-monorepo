import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';
import { ref } from 'lit/directives/ref.js';

/**
 * @attr {Number} value
 */
@customElement('number-field')
export class NumberField extends FieldBase {
  @property({ type: Number })
  value = 0;

  get typedValue(): number {
    return Number(this.fieldEl.value);
  }

  get defaultValue(): number {
    return Number(this.fieldEl.defaultValue);
  }

  override inputControl() {
    return html`
      <input
        type="number"
        name=${this.name}
        value=${this.value}
        class="form-control"
        placeholder=${this.placeholder}
        ?required=${this.required}
        ?readonly=${this.readonly}
        ?disabled=${this.disabled}
        @input=${this.inputHandler}
        ${ref(this.fieldRef)}
      />
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'number-field': NumberField;
  }
}
