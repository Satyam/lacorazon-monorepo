import { LitElement, html, css, nothing, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Ref, createRef } from 'lit/directives/ref.js';
import { BootBase } from './bootstrapBase';

export const INPUT_CHANGED_EVENT: 'inputChanged' = 'inputChanged' as const;

export class InputChangedEvent<T> extends Event {
  name: string;
  value: T;
  isDirty: boolean;
  constructor(name: string, value: T, isDirty: boolean) {
    super(INPUT_CHANGED_EVENT, { composed: true, bubbles: true });
    this.name = name;
    this.value = value;
    this.isDirty = isDirty;
  }
}

/**
 * @attr label
 * @attr name
 * @attr value
 * @attr placeholder
 * @attr errorFeedback
 * @attr hint
 * @attr {Boolean} required
 * @attr {Boolean} readonly
 * @attr {Boolean} disabled
 */
@customElement('field-base')
export abstract class FieldBase<T> extends LitElement {
  static formAssociated = true;
  internals = this.attachInternals();

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

  value?: T;

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

  public get form() {
    return this.internals.form;
  }
  override connectedCallback() {
    super.connectedCallback();
    this.addEventListener('focus', () => this.fieldEl.focus());
  }
  protected get fieldEl() {
    return this.fieldRef.value!;
  }

  protected get fieldValue(): T {
    return this.fieldEl.value as unknown as T;
  }

  protected set fieldValue(v: T) {
    this.fieldEl.value = String(v);
  }

  protected get defaultValue(): T {
    return this.fieldEl.value as unknown as T;
  }

  public get isDirty() {
    return this.fieldEl.value !== this.fieldEl.defaultValue;
  }

  public get isValid() {
    return this.fieldEl.validity.valid;
  }

  protected extraValidationCheck(_field: HTMLInputElement) {
    return true;
  }

  public checkValidity() {
    const field = this.fieldEl;
    const isValid = this.extraValidationCheck(field) && field.checkValidity();
    field.classList.add(isValid ? 'is-valid' : 'is-invalid');

    return isValid;
  }

  protected inputHandler(ev: Event) {
    if (this.name.length === 0 || this.readonly) return;
    ev.preventDefault();
    this.fieldEl.classList.remove('is-valid', 'is-invalid');
    this.value = this.fieldValue;
    return this.dispatchEvent(
      new InputChangedEvent(this.name, this.value, this.isDirty)
    );
  }

  protected abstract inputControl(): HTMLTemplateResult;

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
