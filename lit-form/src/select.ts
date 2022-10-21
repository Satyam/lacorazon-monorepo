import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';
import { ref } from 'lit/directives/ref.js';

/**
 * @attr {Boolean} multiple
 * @attr {Number} size
 * @attr labelFieldName
 * @attr valueFieldName
 * @attr nullLabel
 */
@customElement('select-field')
export class SelectField extends FieldBase<string> {
  @property({ type: String })
  override value = '';

  @property({ type: Boolean })
  multiple = false;

  @property({ type: Number })
  size = 0;

  @property({ type: String })
  labelFieldName = '';

  @property({ type: String })
  valueFieldName = '';

  @property({ attribute: false })
  options: AnyRow[] = [];

  @property({ type: String })
  nullLabel = '';

  override inputControl() {
    const l = this.labelFieldName;
    const v = this.valueFieldName;
    const opts = this.options;
    if (this.nullLabel) {
      opts.unshift({
        [l]: this.nullLabel,
        [v]: null,
      } as AnyRow);
    }
    return html`
      <select
        name=${this.name}
        class="form-control"
        ?multiple=${this.multiple}
        size=${this.size}
        ?required=${this.required}
        ?disabled=${this.disabled}
        @input=${this.inputHandler}
        ${ref(this.fieldRef)}
      >
        ${opts.map(
          (opt) =>
            html`<option
              value=${String(opt[v])}
              ?selected=${String(opt[v]) === this.value}
            >
              ${opt[l]}
            </option>`
        )}
      </select>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'select-field': SelectField;
  }
}
