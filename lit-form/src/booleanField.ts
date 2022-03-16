import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';
import { ref } from 'lit/directives/ref.js';

@customElement('boolean-field')
export class BooleanField extends FieldBase<boolean> {
  @property({ type: Boolean })
  override value = false;

  @property({ type: String })
  checkLabel = '';

  protected override get fieldValue(): boolean {
    return this.fieldEl().checked;
  }
  protected override set fieldValue(v: boolean) {
    this.fieldEl().checked = v;
  }

  // Not sure why I had to do this.
  override reset() {
    super.reset();
    this.fieldValue = this.value;
  }

  override inputControl() {
    return html`
      <input
        type="checkbox"
        name=${this.name}
        ?checked=${this.value}
        class="form-check-input mt-2 me-2"
        placeholder=${this.placeholder}
        ?required=${this.required}
        ?readonly=${this.readonly}
        ?disabled=${this.disabled}
        @input=${this.inputHandler}
        ${ref(this.fieldRef)}
      />
      <span class="form-check-label mt-1">${this.checkLabel}</span>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'boolean-field': BooleanField;
  }
}
