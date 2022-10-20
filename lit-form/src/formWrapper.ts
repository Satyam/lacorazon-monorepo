import { LitElement, html } from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';
import { FieldBase } from './fieldBase';

export const FORM_SUBMIT_EVENT: 'formSubmit' = 'formSubmit' as const;
export class FormSubmitEvent extends Event {
  wrapper: FormWrapper;
  form: HTMLFormElement;
  submitter: HTMLElement | null;
  constructor(
    wrapper: FormWrapper,
    form: HTMLFormElement,
    submitter: HTMLElement | null
  ) {
    super('formSubmit', { composed: true, bubbles: true });
    this.wrapper = wrapper;
    this.form = form;
    this.submitter = submitter;
  }
}

type FieldElement =
  | HTMLInputElement
  | HTMLSelectElement
  | HTMLTextAreaElement
  | HTMLButtonElement;

export const FORM_CHANGED_EVENT: 'formChanged' = 'formChanged' as const;
export class FormChangedEvent extends Event {
  wrapper: FormWrapper;
  form: HTMLFormElement;
  field: FieldElement;
  name: string;
  value: VALUE;
  constructor(
    wrapper: FormWrapper,
    form: HTMLFormElement,
    field: FieldElement,
    name: string,
    value: VALUE
  ) {
    super(FORM_CHANGED_EVENT, { composed: true, bubbles: true });
    this.wrapper = wrapper;
    this.form = form;
    this.field = field;
    this.name = name;
    this.value = value;
  }
}

@customElement('form-wrapper')
export class FormWrapper extends LitElement {
  @queryAssignedElements({ selector: 'form' })
  private _formElements!: Array<HTMLElement>;

  private _formEl: HTMLFormElement | undefined;

  public get fields() {
    return (this._formEl ? [...this._formEl.elements] : []) as FieldElement[];
  }

  public get values() {
    return this.fields.reduce(
      (vals, el) =>
        el.name
          ? {
              ...vals,
              [el.name]: el.value,
            }
          : vals,
      {}
    );
  }

  public get dirtyFields() {
    return this.fields
      .filter((el) =>
        el instanceof FieldBase
          ? el.isDirty
          : el.value !== (el as HTMLInputElement).defaultValue
      )
      .map((el) => el.name);
  }

  public get isDirty() {
    return this.fields.some((el) =>
      el instanceof FieldBase
        ? el.isDirty
        : el.value !== (el as HTMLInputElement).defaultValue
    );
  }

  private _submitHandler = (ev: SubmitEvent) => {
    ev.preventDefault();
    if (this.fields.every((f) => f.checkValidity())) {
      this.dispatchEvent(
        new FormSubmitEvent(this, this._formEl!, ev.submitter)
      );
    }
  };

  private _inputHandler = (ev: InputEvent) => {
    const el = ev.target as FieldElement;
    this.dispatchEvent(
      new FormChangedEvent(this, this._formEl!, el, el.name, el.value)
    );
  };

  override disconnectedCallback() {
    super.disconnectedCallback();
    this._formEl?.removeEventListener('submit', this._submitHandler);
    // @ts-ignore
    this._formEl?.removeEventListener('input', this._inputHandler);
  }

  protected override firstUpdated() {
    this._formEl = this._formElements[0] as HTMLFormElement;
    console.log(this.fields);
    this._formEl?.addEventListener('submit', this._submitHandler);
    // @ts-ignore
    this._formEl?.addEventListener('input', this._inputHandler);
  }

  override render() {
    return html`<slot></slot>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'form-wrapper': FormWrapper;
  }
}
