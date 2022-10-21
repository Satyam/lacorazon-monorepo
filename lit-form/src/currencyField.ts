import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';
import { ref } from 'lit/directives/ref.js';

/**
 * @attr {Number} value
 */
@customElement('currency-field')
export class CurrencyField extends FieldBase<number> {
  @property({ type: Number })
  override value = 0;

  protected override get fieldValue(): number {
    return Number(this.fieldEl.value);
  }
  protected override set fieldValue(v: number) {
    this.fieldEl.value = String(v);
  }

  protected override get defaultValue(): number {
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
