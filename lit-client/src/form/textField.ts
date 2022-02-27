import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';
import { ref } from 'lit/directives/ref.js';

export class InputChanged extends Event {
  name: string;
  value: string;
  constructor(name: string, value: string) {
    super('inputChanged', { composed: true, bubbles: true });
    this.name = name;
    this.value = value;
  }
}

@customElement('text-field')
export class TextField extends FieldBase {
  @property({ type: Boolean })
  password = false;

  override render() {
    return this.fieldFrame(html` <input
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
    />`);
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'text-field': TextField;
  }
}
