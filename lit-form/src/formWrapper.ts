import { LitElement, html } from 'lit';
import { customElement, property } from 'lit/decorators.js';

import { FieldBase, InputChanged } from './fieldBase';
import { getTarget } from './utils';

export const FORM_SUBMIT_EVENT: 'formSubmit' = 'formSubmit' as const;
export class FormSubmit extends Event {
  values: FieldData;
  constructor(values: FieldData) {
    super('formSubmit', { composed: true, bubbles: true });
    this.values = values;
  }
}
export const FORM_CHANGED_EVENT: 'formChanged' = 'formChanged' as const;
export class FormChanged extends Event {
  form: FormWrapper;
  fieldName: string;
  value: VALUE;
  isDirty: boolean;
  constructor(
    form: FormWrapper,
    fieldName: string,
    value: VALUE,
    isDirty: boolean
  ) {
    super(FORM_CHANGED_EVENT, { composed: true, bubbles: true });
    this.form = form;
    this.fieldName = fieldName;
    this.value = value;
    this.isDirty = isDirty;
  }
}

@customElement('form-wrapper')
export class FormWrapper extends LitElement {
  @property({ type: Boolean })
  novalidate = false;

  private _fields: FieldBase<VALUE>[] = [];
  private _values: FieldData = {};
  private _dirtyFields: DirtyFields = {};
  private _submitButtons: HTMLButtonElement[] = [];

  public get values() {
    return this._values;
  }

  public get dirtyFields() {
    return this._dirtyFields;
  }

  public get isDirty() {
    return this._fields.some((f) => f.isDirty);
  }

  private slotChange(ev: { target: HTMLSlotElement }) {
    const findEls = (els: Element[]): void =>
      els.forEach((el) => {
        if (el instanceof FieldBase) {
          this._fields.push(el);
          this._values[el.name] = el.value;
          this._dirtyFields[el.name] = false;
        }

        if (el.nodeName === 'BUTTON') {
          const btn = el as HTMLButtonElement;
          switch (btn.type) {
            case 'submit':
              this._submitButtons.push(btn);
              btn.disabled = true;
              btn.addEventListener('click', this.submitHandler);
              break;
            case 'reset':
              btn.disabled = true;
              btn.addEventListener('click', this.resetHandler);
              break;
          }
        }
        if (el.children.length) findEls(Array.from(el.children));
      });
    this._fields = [];
    this._values = {};
    this._dirtyFields = {};
    this._submitButtons = [];

    findEls(Array.from(ev.target.assignedElements()) as Element[]);
  }

  public reset(): void {
    this._fields.forEach((el) => el.reset());
  }

  private resetHandler = () => {
    this.reset();
  };

  private submitHandler = (ev: Event) => {
    const fieldValues: FieldData = {};

    const submitButton = getTarget<HTMLButtonElement>(ev);
    if (submitButton.name) {
      fieldValues[submitButton.name] = true;
    }
    if (
      this._fields.every((f) => {
        if (f.checkValidity()) {
          fieldValues[f.name] = f.value;
          return true;
        }
        return false;
      })
    ) {
      this._values = fieldValues;
      this.dispatchEvent(new FormSubmit(fieldValues));
    }
  };
  private inputChanged = (ev: InputChanged<VALUE>) => {
    ev.stopPropagation();
    const { isDirty, name, value } = ev;
    this._submitButtons.forEach((btn) => {
      btn.disabled = !isDirty;
    });
    this._dirtyFields[name] = isDirty;
    this._values[name] = value;
    this.dispatchEvent(new FormChanged(this, name, value, this.isDirty));
  };

  override render() {
    return html`<form
      ?novalidate=${this.novalidate}
      @submit=${this.submitHandler}
      @inputChanged=${this.inputChanged}
    >
      <slot @slotchange=${this.slotChange}></slot>
    </form>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'form-wrapper': FormWrapper;
  }
}
