import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';
import { ref } from 'lit/directives/ref.js';

const datePart = (d: Date) => d.toISOString().split('T')[0];

@customElement('date-field')
export class DateField extends FieldBase<Date> {
  @property({
    type: Date,
    converter: {
      fromAttribute: (value) => (value ? new Date(value) : new Date()),
      toAttribute: (value: Date) => value.toLocaleDateString(),
    },
  })
  override value: Date = new Date();

  protected override get fieldValue(): Date {
    return new Date(this.fieldEl().value);
  }
  protected override set fieldValue(v: Date) {
    this.fieldEl().value = datePart(v);
  }

  // Not sure why I had to do this.
  override reset() {
    super.reset();
    this.fieldValue = this.value;
  }

  override inputControl() {
    console.log(
      this.value,
      this.value instanceof Date,
      this.value.toISOString(),
      datePart(this.value)
    );
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
