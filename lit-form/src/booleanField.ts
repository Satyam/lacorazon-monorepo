import { html, svg } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';
import { ref } from 'lit/directives/ref.js';

const svgCheckSquareFill = svg`<path
d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm10.03 4.97a.75.75 0 0 1 .011 1.05l-3.992 4.99a.75.75 0 0 1-1.08.02L4.324 8.384a.75.75 0 1 1 1.06-1.06l2.094 2.093 3.473-4.425a.75.75 0 0 1 1.08-.022z"
/>`;

const svgSquare = svg`<path
d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z"
/>`;

/**
 * @attr checkLabel
 * @attr {Boolean} checked
 */
@customElement('boolean-field')
export class BooleanField extends FieldBase {
  @property({ type: Boolean })
  checked = false;

  @property({ type: String })
  checkLabel = '';

  get typedValue(): boolean {
    return this.fieldEl.checked;
  }

  set typedValue(v) {
    this.fieldEl.checked = !!v;
  }

  get defaultValue(): boolean {
    return this.fieldEl.defaultChecked;
  }
  override inputControl() {
    // It is important that I render an actual input box even if not visible because it is readonly
    // because fieldBase expects to find an actual input box even if only an svg image is shown

    return html`${this.readonly
        ? html`<svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            viewBox="0 0 16 16"
            class="form-check-input mt-2 me-2"
          >
            ${this.checked ? svgCheckSquareFill : svgSquare}
          </svg>`
        : null}
      <input
        type="checkbox"
        name=${this.name}
        ?checked=${this.checked}
        class=${`form-check-input mt-2 me-2 ${this.readonly ? 'd-none' : ''}`}
        placeholder=${this.placeholder}
        ?required=${this.required}
        ?readonly=${this.readonly}
        ?disabled=${this.disabled}
        @input=${this.inputHandler}
        ${ref(this.fieldRef)}
      />
      <span class="form-check-label mt-1">${this.checkLabel}</span> `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'boolean-field': BooleanField;
  }
}
