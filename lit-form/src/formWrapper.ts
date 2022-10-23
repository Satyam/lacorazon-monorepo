import { LitElement, html } from 'lit';
import { customElement, queryAssignedElements } from 'lit/decorators.js';
import {
  FieldBase,
  InputRenderedEvent,
  InputChangedEvent,
  INPUT_RENDERED_EVENT,
  INPUT_CHANGED_EVENT,
} from './fieldBase';

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
  constructor() {
    super();
    this.addEventListener(INPUT_RENDERED_EVENT, this._registerField);
    this.addEventListener('submit', this._submitHandler);
    this.addEventListener(INPUT_CHANGED_EVENT, this._inputHandler);
  }

  @queryAssignedElements({ selector: 'form' })
  private _formElements!: Array<HTMLElement>;

  private _formEl: HTMLFormElement | undefined;

  private _fields: FieldBase[] = [];

  public get values() {
    return this._fields.reduce(
      (vals, el) =>
        el.name
          ? {
              ...vals,
              [el.name]: el.typedValue,
            }
          : vals,
      {}
    );
  }

  public get dirtyFields() {
    return this._fields.filter((el) => el.isDirty).map((el) => el.name);
  }

  public get isDirty() {
    return this._fields.some((el) => el.isDirty);
  }

  private _registerField(ev: Event) {
    ev.stopPropagation();
    const { fieldBase } = ev as InputRenderedEvent;
    this._fields.push(fieldBase);
  }

  private _submitHandler = (ev: SubmitEvent) => {
    ev.preventDefault();
    if (this._fields.every((f) => f.checkValidity())) {
      this.dispatchEvent(
        new FormSubmitEvent(this, this._formEl!, ev.submitter)
      );
    }
  };

  private _inputHandler = (ev: Event) => {
    const { name, typedValue } = ev as InputChangedEvent;
    const el = ev.target as FieldElement;
    this.dispatchEvent(
      new FormChangedEvent(this, this._formEl!, el, name, typedValue)
    );
  };

  protected override firstUpdated() {
    this._formEl = this._formElements[0] as HTMLFormElement;
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
