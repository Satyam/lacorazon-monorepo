import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';
import { ref } from 'lit/directives/ref.js';

// Don't use toISOString because it gives the date un UTC time, not local
// and may show a different day close to midnight.
const datePart = (d: Date = new Date()) =>
  [
    d.getFullYear().toString().padStart(4, '0'),
    (d.getMonth() + 1).toString().padStart(2, '0'),
    d.getDate().toString().padStart(2, '0'),
  ].join('-');

/**
 * @attr {Date} value
 */
@customElement('date-field')
export class DateField extends FieldBase {
  @property({
    type: Date,
    converter: (value) => (value ? new Date(value) : new Date()),
  })
  value = new Date();

  get typedValue(): Date {
    return new Date(this.fieldEl.value);
  }

  get defaultValue(): Date {
    return new Date(this.fieldEl.defaultValue);
  }

  override inputControl() {
    return html`
      <input
        type="date"
        name=${this.name}
        value=${datePart(this.value)}
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
    'date-field': DateField;
  }
}
