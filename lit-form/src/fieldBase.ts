import { LitElement, html, css, nothing, HTMLTemplateResult } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Ref, createRef } from 'lit/directives/ref.js';
import { BootBase } from './bootstrapBase';

export const INPUT_CHANGED_EVENT: 'inputChanged' = 'inputChanged' as const;

export class InputChangedEvent extends Event {
  name: string;
  typedValue: any;
  isDirty: boolean;
  constructor(name: string, typedValue: any, isDirty: boolean) {
    super(INPUT_CHANGED_EVENT, { composed: true, bubbles: true });
    this.name = name;
    this.typedValue = typedValue;
    this.isDirty = isDirty;
  }
}

export const INPUT_RENDERED_EVENT: 'inputRendered' = 'inputRendered' as const;
export class InputRenderedEvent extends Event {
  name: string;
  fieldBase: FieldBase;
  constructor(name: string, fieldBase: FieldBase) {
    super(INPUT_RENDERED_EVENT, { composed: true, bubbles: true });
    this.name = name;
    this.fieldBase = fieldBase;
  }
}

/**
 * @attr label
 * @attr name
 * @attr placeholder
 * @attr errorFeedback
 * @attr hint
 * @attr {Boolean} required
 * @attr {Boolean} readonly
 * @attr {Boolean} disabled
 */
@customElement('field-base')
export abstract class FieldBase extends LitElement {
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

  abstract get typedValue(): unknown;

  abstract get defaultValue(): unknown;

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
    return this.dispatchEvent(
      new InputChangedEvent(this.name, this.typedValue, this.isDirty)
    );
  }

  protected abstract inputControl(): HTMLTemplateResult;

  override firstUpdated() {
    this.dispatchEvent(new InputRenderedEvent(this.name, this));
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
