import { LitElement, html, css, nothing } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Ref, createRef } from 'lit/directives/ref.js';
import { BootBase } from '../bootstrapBase';
import { getTarget } from '../utils';

export class InputChanged extends Event {
  name: string;
  value: string;
  isDirty: boolean;
  constructor(name: string, value: string, isDirty: boolean) {
    super('inputChanged', { composed: true, bubbles: true });
    this.name = name;
    this.value = value;
    this.isDirty = isDirty;
  }
}

@customElement('field-base')
export class FieldBase extends LitElement {
  static override readonly styles = [
    BootBase.styles,
    css`
      label {
        margin: 0.3rem 0;
      }
      @media (min-width: 576px) {
        .input-group {
          /* to cancel out the width from input-group, taken from  col-sm-10 -*/
          width: 83.3333%;
        }
      }
    `,
  ];

  @property({ type: String })
  label = '';

  @property({ type: String })
  name = '';

  @property({ type: String })
  value = '';

  @property({ type: String })
  placeholder = '';

  @property({ type: String })
  errorFeedback = '';

  @property({ type: String })
  hint = '';

  @property({ type: Boolean })
  required = false;

  @property({ type: Boolean })
  readonly = false;

  @property({ type: Boolean })
  disabled = false;

  protected fieldRef: Ref<HTMLInputElement> = createRef();

  protected fieldEl() {
    return this.fieldRef.value!;
  }

  public defaultValue?: string;

  public get isDirty() {
    return this.value !== this.defaultValue;
  }

  protected override firstUpdated() {
    this.defaultValue = this.fieldEl().defaultValue;
  }

  protected extraValidationCheck(_field: HTMLInputElement) {
    return true;
  }

  public checkValidity() {
    const field = this.fieldEl();
    const isValid = this.extraValidationCheck(field) && field.checkValidity();
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');

    return isValid;
  }

  public reset() {
    if (this.defaultValue) {
      this.value = this.defaultValue;
      this.dispatchEvent(new InputChanged(this.name, this.value, false));
    }
  }

  protected inputHandler(ev: Event) {
    ev.preventDefault();
    this.fieldEl().classList.remove('is-valid', 'is-invalid');
    this.value = getTarget<HTMLInputElement>(ev).value;
    return this.dispatchEvent(
      new InputChanged(this.name, this.value, this.value !== this.defaultValue)
    );
  }

  protected inputControl() {
    return html``;
  }

  protected override render() {
    return html`
      <label class="form-group row">
        <div class="col-sm-2 col-form-label">${this.label}</div>
        <div class="input-group col-sm-10">
          ${this.inputControl()}
          ${this.errorFeedback
            ? html`<div class="invalid-feedback">${this.errorFeedback}</div>`
            : null}
          ${this.hint
            ? html`<div class="form-text">${this.hint}</div>`
            : nothing}
        </div>
      </label>
    `;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'field-base': FieldBase;
  }
}
