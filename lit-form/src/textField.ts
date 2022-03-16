import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';
import { ref } from 'lit/directives/ref.js';

@customElement('text-field')
export class TextField extends FieldBase<string> {
  @property({ type: String })
  override value = '';

  @property({ type: Boolean })
  password = false;

  // Not sure why I had to do this.
  override reset() {
    super.reset();
    this.fieldEl().value = this.value;
  }

  override inputControl() {
    return html`
      <input
        type=${this.password ? 'password' : 'text'}
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
    'text-field': TextField;
  }
}
