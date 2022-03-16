import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';

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

  @state()
  wasValidated = false;

  _values: FieldData = {};
  _dirtyFields: DirtyFields = {};

  public get values() {
    return this._values;
  }

  public get dirtyFields() {
    return this._dirtyFields;
  }

  public get isDirty() {
    return this.fields()?.some((f) => f.isDirty);
  }

  private submitButtons: HTMLButtonElement[] = [];

  private elements(): HTMLElement[] | FieldBase<VALUE>[] {
    const slot = this.shadowRoot?.querySelector('slot');
    return slot?.assignedElements({ flatten: true }) as
      | HTMLElement[]
      | FieldBase<VALUE>[];
  }

  private fields(): FieldBase<VALUE>[] {
    return this.elements().filter(
      (el) => el instanceof FieldBase && el.name.length
    ) as FieldBase<VALUE>[];
  }

  public reset(): void {
    this.fields()?.forEach((el) => el.reset());
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
    this.wasValidated = true;
    if (
      this.fields()?.every((f) => {
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
    this.submitButtons.forEach((btn) => {
      btn.disabled = !isDirty;
    });
    this._dirtyFields[name] = isDirty;
    this._values[name] = value;
    this.dispatchEvent(new FormChanged(this, name, value, this.isDirty));
  };

  protected override firstUpdated(): void {
    this.fields()?.forEach((el) => {
      this._values[el.name] = el.value;
      this._dirtyFields[el.name] = false;
    });
    this.elements()
      .filter((el) => ['BUTTON', 'INPUT'].includes(el.nodeName))
      ?.forEach((btn) => {
        switch ((btn as HTMLButtonElement).type) {
          case 'submit':
            this.submitButtons.push(btn as HTMLButtonElement);
            btn.addEventListener('click', this.submitHandler);
            break;
          case 'reset':
            btn.addEventListener('click', this.resetHandler);
            break;
        }
      });
  }

  override render() {
    return html`<form
      ?novalidate=${this.novalidate}
      @submit=${this.submitHandler}
      @inputChanged=${this.inputChanged}
    >
      <slot></slot>
    </form>`;
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'form-wrapper': FormWrapper;
  }
}
