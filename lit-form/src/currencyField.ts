import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';
import { ref } from 'lit/directives/ref.js';

/**
 * @attr {Number} value
 */
@customElement('currency-field')
export class CurrencyField extends FieldBase {
  @property({ type: String })
  value = '0';

  get typedValue(): number {
    return Number(this.fieldEl.value);
  }

  set typedValue(v) {
    this.value = String(v);
  }

  get defaultValue(): number {
    return Number(this.fieldEl.defaultValue);
  }

  override inputControl() {
    return html`
      <span class="input-group-text">€</span>
      <input
        type="number"
        name=${this.name}
        value=${String(this.value)}
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
    'currency-field': CurrencyField;
  }
}
