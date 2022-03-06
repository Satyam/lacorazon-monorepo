import { html } from 'lit';
import { customElement } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';
import { ref } from 'lit/directives/ref.js';

@customElement('email-field')
export class EmailField extends FieldBase {
  // Not sure why I had to do this.
  override reset() {
    super.reset();
    this.fieldEl().value = this.value;
  }

  override inputControl() {
    return html`
      <input
        type="email"
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
    'email-field': EmailField;
  }
}
