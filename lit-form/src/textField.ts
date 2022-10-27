import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';
import { ref } from 'lit/directives/ref.js';
/**
 * @attr value
 * @attr {Boolean} password
 */
@customElement('text-field')
export class TextField extends FieldBase {
  @property({ type: Boolean })
  password = false;

  @property({ type: String })
  value = '';

  get typedValue() {
    return this.fieldEl.value;
  }

  get defaultValue(): string {
    return this.fieldEl.defaultValue;
  }

  override inputControl() {
    return html`
      <input
        type=${this.password ? 'password' : 'text'}
        name=${this.name}
        value=${this.value}
        tabindex="0"
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
